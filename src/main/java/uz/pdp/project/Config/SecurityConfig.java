package uz.pdp.project.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/**",
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/error")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET, "/auth/signin", "/auth/signup", "/auth/check-page").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/signin", "/auth/signup").permitAll()
                        .anyRequest().authenticated())
                .formLogin(form -> form
                        .disable())
                .httpBasic(basic -> basic.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}