package com.fincrime.processmining.controller;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Path;
import org.junit.jupiter.api.Test;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleValidation_returns400WithSanitizedMessage() {
        @SuppressWarnings("unchecked")
        ConstraintViolation<Object> violation = mock(ConstraintViolation.class);
        Path path = mock(Path.class);
        when(path.toString()).thenReturn("caseTypeId");
        when(violation.getPropertyPath()).thenReturn(path);
        when(violation.getMessage()).thenReturn("must be greater than 0");
        ConstraintViolationException ex = new ConstraintViolationException(Set.of(violation));

        var response = handler.handleValidation(ex);

        assertThat(response.getStatusCode().value()).isEqualTo(400);
        Map<String, Object> body = response.getBody();
        assertThat(body).containsKey("error");
        assertThat(body.get("error")).isEqualTo("Invalid request parameters");
        assertThat(body).containsKey("timestamp");
    }

    @Test
    void handleValidation_doesNotExposeInternalDetails() {
        @SuppressWarnings("unchecked")
        ConstraintViolation<Object> violation = mock(ConstraintViolation.class);
        Path path = mock(Path.class);
        when(path.toString()).thenReturn("field");
        when(violation.getPropertyPath()).thenReturn(path);
        when(violation.getMessage()).thenReturn("SQL injection attempt; DROP TABLE");
        ConstraintViolationException ex = new ConstraintViolationException(Set.of(violation));

        var response = handler.handleValidation(ex);

        assertThat(response.getBody().get("error").toString()).doesNotContain("SQL");
        assertThat(response.getBody().get("error").toString()).doesNotContain("DROP");
    }

    @Test
    void handleTypeMismatch_returns400() {
        MethodArgumentTypeMismatchException ex = new MethodArgumentTypeMismatchException(
                "abc", Integer.class, "caseTypeId", null, new NumberFormatException("For input string: \"abc\""));

        var response = handler.handleTypeMismatch(ex);

        assertThat(response.getStatusCode().value()).isEqualTo(400);
        assertThat(response.getBody().get("error")).isEqualTo("Invalid parameter type");
    }

    @Test
    void handleIllegalArgument_returns400() {
        IllegalArgumentException ex = new IllegalArgumentException("invalid value");

        var response = handler.handleIllegalArgument(ex);

        assertThat(response.getStatusCode().value()).isEqualTo(400);
        assertThat(response.getBody().get("error")).isEqualTo("Invalid request");
    }

    @Test
    void handleGeneral_returns500WithGenericMessage() {
        Exception ex = new RuntimeException("Unexpected NPE at line 42");

        var response = handler.handleGeneral(ex);

        assertThat(response.getStatusCode().value()).isEqualTo(500);
        String error = response.getBody().get("error").toString();
        assertThat(error).doesNotContain("NPE");
        assertThat(error).doesNotContain("line 42");
        assertThat(error).contains("internal error");
    }

    @Test
    void allHandlers_includeTimestamp() {
        assertThat(handler.handleIllegalArgument(new IllegalArgumentException("x"))
                .getBody()).containsKey("timestamp");
        assertThat(handler.handleGeneral(new RuntimeException("x"))
                .getBody()).containsKey("timestamp");
    }
}
