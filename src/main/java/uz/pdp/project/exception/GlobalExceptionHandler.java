package uz.pdp.project.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus; 
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.ui.Model;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Handles all uncaught exceptions with a comprehensive error response
     */
    @ExceptionHandler(Exception.class)
    public ModelAndView handleAllUncaughtExceptions(Exception ex, WebRequest request) {
        // Log the full stack trace for server-side debugging
        log.error("Unhandled exception occurred", ex);

        // Determine the appropriate HTTP status and error message
        HttpStatus status = determineHttpStatus(ex);
        String userMessage = createUserFriendlyMessage(ex);
        String technicalDetails = getTechnicalDetails(ex);

        // Create ModelAndView for error page
        ModelAndView modelAndView = new ModelAndView("error");
        modelAndView.addObject("status", status.value());
        modelAndView.addObject("message", userMessage);
        modelAndView.addObject("timestamp", LocalDateTime.now());
        modelAndView.addObject("technicalDetails", technicalDetails);
        modelAndView.setStatus(status);

        return modelAndView;
    }

    /**
     * Determine the appropriate HTTP status based on exception type
     */
    private HttpStatus determineHttpStatus(Exception ex) {
        if (ex instanceof NoHandlerFoundException) {
            return HttpStatus.NOT_FOUND;
        } else if (ex instanceof AccessDeniedException) {
            return HttpStatus.FORBIDDEN;
        } else if (ex instanceof AuthenticationCredentialsNotFoundException) {
            return HttpStatus.UNAUTHORIZED;
        } else if (ex instanceof EntityNotFoundException) {
            return HttpStatus.NOT_FOUND;
        } else if (ex instanceof DataIntegrityViolationException) {
            return HttpStatus.CONFLICT;
        } else if (ex instanceof MethodArgumentNotValidException || 
                   ex instanceof BindException || 
                   ex instanceof ConstraintViolationException) {
            return HttpStatus.BAD_REQUEST;
        } else if (ex instanceof MaxUploadSizeExceededException) {
            return HttpStatus.PAYLOAD_TOO_LARGE;
        } else if (ex instanceof DataAccessException) {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
        
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    /**
     * Create a user-friendly error message
     */
    private String createUserFriendlyMessage(Exception ex) {
        if (ex instanceof NoHandlerFoundException) {
            return "Запрошенная страница не найдена";
        } else if (ex instanceof AccessDeniedException) {
            return "У вас недостаточно прав для выполнения этого действия";
        } else if (ex instanceof AuthenticationCredentialsNotFoundException) {
            return "Требуется авторизация";
        } else if (ex instanceof EntityNotFoundException) {
            return "Запрошенный ресурс не существует";
        } else if (ex instanceof DataIntegrityViolationException) {
            return "Операция нарушает целостность данных";
        } else if (ex instanceof MethodArgumentNotValidException methodEx) {
            return methodEx.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        } else if (ex instanceof MaxUploadSizeExceededException) {
            return "Размер загружаемого файла превышает допустимый лимит";
        } else if (ex instanceof DataAccessException) {
            return "Ошибка при работе с базой данных";
        }
        
        return "Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.";
    }

    /**
     * Capture technical details for logging
     */
    private String getTechnicalDetails(Exception ex) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        ex.printStackTrace(pw);
        return sw.toString();
    }
}
