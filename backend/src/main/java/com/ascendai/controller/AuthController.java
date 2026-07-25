package com.ascendai.controller;

import com.ascendai.dto.*;
import com.ascendai.entity.RefreshToken;
import com.ascendai.entity.User;
import com.ascendai.repository.UserRepository;
import com.ascendai.security.UserDetailsImpl;
import com.ascendai.service.RefreshTokenService;
import com.ascendai.util.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Set<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority().replace("ROLE_", ""))
                .collect(Collectors.toSet());

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

        JwtResponse jwtResponse = new JwtResponse(
                jwt,
                refreshToken.getToken(),
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getUsername(),
                userDetails.getAvatarInitials(),
                roles
        );

        return ResponseEntity.ok(ApiResponse.success("Authentication successful", jwtResponse));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email is already in use!"));
        }

        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        
        String initials = signUpRequest.getName().substring(0, 1).toUpperCase();
        if (signUpRequest.getName().contains(" ")) {
            initials += signUpRequest.getName().split(" ")[1].substring(0, 1).toUpperCase();
        }
        user.setAvatarInitials(initials);
        
        Set<String> roles = new HashSet<>();
        roles.add("USER");
        user.setRoles(roles);
        user.setJoinedAt(LocalDateTime.now());

        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("User registered successfully!", null));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<TokenRefreshResponse>> refreshtoken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUserId)
                .map(userId -> {
                    User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
                    String token = jwtUtils.generateTokenFromUsername(user.getEmail());
                    return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", new TokenRefreshResponse(token, requestRefreshToken)));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDetailsImpl>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthenticated"));
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Current user retrieved", userDetails));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logoutUser(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            refreshTokenService.deleteByUserId(userDetails.getId());
        }
        return ResponseEntity.ok(ApiResponse.success("User logged out successfully!", null));
    }
}
