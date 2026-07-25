package com.ascendai.dto;

import java.util.Set;

public class JwtResponse {
    private String token;
    private String refreshToken;
    private String type = "Bearer";
    private String id;
    private String name;
    private String email;
    private String avatarInitials;
    private Set<String> roles;

    public JwtResponse(String accessToken, String refreshToken, String id, String name, String email, String avatarInitials, Set<String> roles) {
        this.token = accessToken;
        this.refreshToken = refreshToken;
        this.id = id;
        this.name = name;
        this.email = email;
        this.avatarInitials = avatarInitials;
        this.roles = roles;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAvatarInitials() { return avatarInitials; }
    public void setAvatarInitials(String avatarInitials) { this.avatarInitials = avatarInitials; }
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
}
