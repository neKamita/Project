// Authentication page specific functionality
class AuthPage {
  constructor() {
    this.form = document.querySelector(".auth-form");
    this.signInForm = this.form; // Используем ту же форму для входа
    this.passwordInputs = document.querySelectorAll('input[type="password"]');
    this.emailInput = document.querySelector('input[type="email"]');

    this.init();
  }

  init() {
    // Проверяем текущую страницу
    this.checkCurrentPage();

    this.setupFormValidation();
    this.setupPasswordToggles();
    this.setupPasswordStrength();
    this.setupSocialAuth();
  }

  checkCurrentPage() {
    // Проверяем, какая страница загружена
    fetch("/auth/check-page")
      .then((response) => response.json())
      .then((data) => {
        console.log("Current page:", data.page);
        // Можно добавить дополнительную логику для разных страниц
      })
      .catch((error) => {
        console.error("Error checking page:", error);
      });
  }

  setupFormValidation() {
    if (this.form) {
      this.form.addEventListener("submit", (event) => {
        event.preventDefault();
        const url = this.form.getAttribute("action");
        const data = this.collectFormData();

        if (url.includes("/signup")) {
          // Get password inputs
          const password = document.getElementById('password').value;
          const confirmPassword = document.getElementById('confirmPassword').value;

          // Check if passwords match first
          if (password !== confirmPassword) {
            this.showError("Пароли не совпадают");
            return;
          }

          // Then check password strength
          const passwordValidation = this.calculatePasswordStrength(password);
          if (!passwordValidation.isValid) {
            passwordValidation.failedChecks.forEach(check => {
              window.ChefShare.Toast.show(check, 'warning');
            });
            return;
          }
        }

        this.submitForm(url, data);
      });
    }
  }

  collectFormData() {
    const formData = {};
    const inputs = this.form.querySelectorAll("input");
    const url = this.form.getAttribute("action");

    // Determine if this is a sign-up or sign-in form based on the URL
    const isSignUpForm = url.includes("/signup");

    inputs.forEach((input) => {
      if (input.name) {
        // Always include email and password
        if (input.name === "email" || input.name === "password") {
          formData[input.name] = input.value;
        }

        // For sign-up, include additional fields
        if (isSignUpForm) {
          const additionalSignUpFields = [
            "username",
            "firstName",
            "lastName", // Optional field
          ];

          if (additionalSignUpFields.includes(input.name)) {
            // Only add non-empty values
            if (input.value.trim() !== "") {
              formData[input.name] = input.value.trim();
            }
          }
        }
      }
    });

    return formData;
  }
  submitForm(url, data) {
    window.ChefShare.LoaderManager.show();
    const isSignUpForm = url.includes("/signup");

    // Validation checks...
    if (isSignUpForm) {
        const requiredSignUpFields = ["email", "password", "username", "firstName"];
        const missingFields = requiredSignUpFields.filter((field) => !data[field]);

        if (missingFields.length > 0) {
            setTimeout(() => {
                window.ChefShare.LoaderManager.hide();
                setTimeout(() => {
                    this.showError(`Пожалуйста, заполните обязательные поля: ${missingFields.join(", ")}`);
                }, 1000);
            }, 1500);
            return;
        }
    } else {
        if (!data || !data.email || !data.password) {
            setTimeout(() => {
                window.ChefShare.LoaderManager.hide();
                setTimeout(() => {
                    this.showError("Пожалуйста, заполните email и пароль");
                }, 1000);
            }, 1500);
            return;
        }
    }

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((err) => {
                    setTimeout(() => {
                        window.ChefShare.LoaderManager.hide();
                        setTimeout(() => {
                            this.showError(err.details || "Ошибка при регистрации");
                        }, 1000);
                    }, 1500);
                    throw new Error(err.details || "Ошибка при регистрации");
                });
            }
            return response.json();
        })
        .then((result) => {
            setTimeout(() => {
                window.ChefShare.LoaderManager.hide();
                if (result.error) {
                    setTimeout(() => {
                        const errorMessage = result.message || result.details || "Неизвестная ошибка входа";
                        this.showError(errorMessage);
                    }, 1000);
                } else {
                    setTimeout(() => {
                        this.showSuccess(result.message || "Вход выполнен успешно!");
                        setTimeout(() => {
                            window.location.href = result.redirect || "/";
                        }, 3000);
                    }, 1000);
                }
            }, 1500);
        })
        .catch((error) => {
            setTimeout(() => {
                window.ChefShare.LoaderManager.hide();
                setTimeout(() => {
                    console.error("Auth error:", error);
                    this.showError("Произошла ошибка при отправке формы");
                }, 1000);
            }, 1500);
        });
}

  validateForm() {
    let isValid = true;
    const inputs = this.form.querySelectorAll("input");

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(input) {
    const existingError = input.parentNode.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    const value = input.value.trim();
    const type = input.type;
    let isValid = true;

    if (input.hasAttribute("required") && value === "") {
      this.showFieldError(input, "Это поле обязательно для заполнения");
      return false;
    }

    if (type === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        this.showFieldError(input, "Введите корректный адрес электронной почты");
        return false;
      }
    }

    return isValid;
  }

  showFieldError(input, message) {
    const errorElement = document.createElement("div");
    errorElement.classList.add("error-message");
    errorElement.textContent = message;
    input.parentNode.insertBefore(errorElement, input.nextSibling);
  }

  setupPasswordToggles() {
    this.passwordInputs.forEach((input) => {
      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.classList.add("password-toggle");
      toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';

      toggleBtn.addEventListener("click", () => {
        const type = input.type === "password" ? "text" : "password";
        input.type = type;
        toggleBtn.querySelector("i").classList.toggle("fa-eye");
        toggleBtn.querySelector("i").classList.toggle("fa-eye-slash");
      });

      input.parentNode.insertBefore(toggleBtn, input.nextSibling);
    });
  }
  setupPasswordStrength() {
    const passwordInput = document.querySelector('input[name="password"]');
    const strengthIndicator = document.querySelector(".password-strength");

    if (passwordInput && strengthIndicator) {
      passwordInput.addEventListener("input", (e) => {
        const result = this.calculatePasswordStrength(e.target.value);

        // Clear previous indicators
        strengthIndicator.innerHTML = "";

        // Add strength bars
        for (let i = 0; i < 5; i++) {
          const bar = document.createElement("div");
          bar.classList.add("strength-bar");

          if (i < result.strength) {
            bar.classList.add("active");
            if (result.strength <= 2) {
              bar.style.backgroundColor = "#ff4444"; // Слабый - красный
            } else if (result.strength <= 3) {
              bar.style.backgroundColor = "#ffbb33"; // Средний - желтый
            } else {
              bar.style.backgroundColor = "#00C851"; // Сильный - зеленый
            }
          }
          strengthIndicator.appendChild(bar);
        }

        // Add strength text
        const strengthText = document.createElement("span");
        strengthText.style.marginLeft = "10px";
        strengthText.style.fontSize = "0.9em";

        if (result.strength <= 2) {
          strengthText.textContent = "Слабый пароль";
          strengthText.style.color = "#ff4444";
        } else if (result.strength <= 3) {
          strengthText.textContent = "Средний пароль";
          strengthText.style.color = "#ffbb33";
        } else {
          strengthText.textContent = "Сильный пароль";
          strengthText.style.color = "#00C851";
        }

        strengthIndicator.appendChild(strengthText);
      });
    }
  }

  calculatePasswordStrength(password) {
    const validations = [
      { regex: /.{8,}/, points: 1, message: "Минимум 8 символов" },
      { regex: /[a-z]+/, points: 1, message: "Строчные буквы" },
      { regex: /[A-Z]+/, points: 1, message: "Заглавные буквы" },
      { regex: /[0-9]+/, points: 1, message: "Цифры" },
      { regex: /[!@#$%^&*(),.?":{}|<>]/, points: 1, message: "Спецсимволы" },
    ];

    let strength = 0;
    const failedChecks = [];

    validations.forEach((validation) => {
      if (validation.regex.test(password)) {
        strength++;
      } else {
        failedChecks.push(validation.message);
      }
    });

    return {
      strength,
      failedChecks,
      isValid: strength >= 4, // Требуем минимум 4 из 5 критериев
    };
  }

  setupSocialAuth() {
    const socialButtons = document.querySelectorAll(".social-button");
    socialButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const provider = button.getAttribute("data-provider");
        this.initiateSocialLogin(provider);
      });
    });
  }

  initiateSocialLogin(provider) {
    // Заглушка для социальной авторизации
    console.log(`Initiating login with ${provider}`);
    NotificationManager.show(
      `Вход через ${provider} временно недоступен`,
      "warning"
    );
  }

  showError(message) {
    window.ChefShare.Toast.show(message, 'error');
  }

  showSuccess(message) {
    window.ChefShare.Toast.show(message, 'success');
  }
}

// Initialize auth page functionality
document.addEventListener("DOMContentLoaded", () => {
  new AuthPage();
});
