package com.arbaazkhan.servermanager;

import com.arbaazkhan.servermanager.enumeration.Status;
import com.arbaazkhan.servermanager.model.Server;
import com.arbaazkhan.servermanager.repo.ServerRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@SpringBootApplication
public class ServermanagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServermanagerApplication.class, args);
	}

	//Dummy data for our repo
	@Bean
	CommandLineRunner run(ServerRepo serverRepo) {
		return args -> {
			serverRepo.save(new Server(null,  "192.168.1.120", "Windows", "16 GB", "Personal PC",
					"http://locahost:8080/server/image/serer2.png", Status.SERVER_UP));
			serverRepo.save(new Server(null,  "192.168.1.10", "Ubuntu", "16 GB", "Dell Tower",
					"http://locahost:8080/server/image/serer4.png", Status.SERVER_DOWN));
			serverRepo.save(new Server(null,  "192.168.1.180", "MS 20010", "32 GB", "Web Server",
					"http://locahost:8080/server/image/serer1.png", Status.SERVER_UP));
			serverRepo.save(new Server(null,  "192.168.1.155", "Windows", "32 GB", "Corperate PC",
					"http://locahost:8080/server/image/serer3.png", Status.SERVER_DOWN));
		};
	}
	
	@Bean
	public CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
		CorsConfiguration corsConfiguration = new CorsConfiguration();
		corsConfiguration.setAllowCredentials(true);
		corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:3000","http://localhost:4200"));
		corsConfiguration.setAllowedHeaders(Arrays.asList("Origin", "Access-Control-Allow-Origin", "Content-Type",
				"Accept", "Jwt-Token", "Authorization", "Origin, Accept", "X-Requested-With",
				"Access-Control-Request-Method", "Access-Control-Request-Headers"));
		corsConfiguration.setExposedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Jwt-Token", "Authorization",
				"Access-Control-Allow-Origin", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials", "Filename"));
		corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
		return new CorsFilter(urlBasedCorsConfigurationSource);
	}
}
