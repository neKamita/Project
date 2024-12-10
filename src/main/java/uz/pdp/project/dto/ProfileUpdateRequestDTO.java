package uz.pdp.project.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequestDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String specializations;
    private String experience;
    private String about;
}