package uz.pdp.project.dto;

public record ResponseMessage(Boolean success, String message, Object data) {
}
