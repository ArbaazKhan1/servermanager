package com.arbaazkhan.servermanager.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.experimental.SuperBuilder;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Map;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

//Will send info over to the user whenever a request comes to the backend is made
@Data
@SuperBuilder
@JsonInclude(NON_NULL) //any field that is null will not be included in the response
public class Response {
    protected LocalDateTime timeStamp;
    protected int statusCode;
    protected HttpStatus status;
    protected String message;
    protected String reason;
    protected String devMessage;
    protected Map<?, ?> data;
}
