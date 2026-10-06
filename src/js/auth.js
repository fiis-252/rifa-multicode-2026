import { apiClient } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
	const token = localStorage.getItem("vendor_token");
  const exp = localStorage.getItem("vendor_token_exp");
  if (token && exp && Date.now() < Number(exp)) {
    window.location.replace("/dashboard");
    return;
	}
	
  const reqForm = document.getElementById("form-request-otp");
  const verifyForm = document.getElementById("form-verify-otp");
  const btnReq = document.getElementById("btn-request-otp");
  const btnVerify = document.getElementById("btn-verify-otp");
  const btnBack = document.getElementById("btn-back-to-request");
  const statusEl = document.getElementById("auth-status");
	let userIdentifier = "";

  function setStatus(msg, type = "error") {
    statusEl.style.display = "block";
    statusEl.className = `search-status ${type}`;
    statusEl.textContent = msg;
  }

  function clearStatus() {
    statusEl.style.display = "none";
    statusEl.textContent = "";
  }

  if (reqForm) {
    reqForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearStatus();
      userIdentifier = document.getElementById("identifier").value.trim();

      if (!userIdentifier) return;

      btnReq.disabled = true;
      btnReq.textContent = "Enviando código...";

      try {
        const res = await apiClient.auth.sendOtp(userIdentifier);
        if (res && res.success) {
          reqForm.style.display = "none";
          verifyForm.style.display = "flex";
          setStatus(
            "Código enviado. Revisa tu correo institucional.",
            "loading",
          );
          document.getElementById("otp").focus();
        } else {
          setStatus(
            res?.message ||
              "Error: Verifica que estés registrado en el padrón de vendedores.",
          );
        }
      } catch (error) {
        console.error("[auth error]", error);
        setStatus(
          "Error de conexión con el servidor. Consulta con tu delegado de base.",
        );
      } finally {
        btnReq.disabled = false;
        btnReq.textContent = "Solicitar Código OTP";
      }
    });
  }

  if (verifyForm) {
    verifyForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearStatus();
      const otpCode = document.getElementById("otp").value.trim();

      if (otpCode.length < 6) {
        setStatus("El código debe tener 6 dígitos.");
        return;
      }

      btnVerify.disabled = true;
      btnVerify.textContent = "Validando...";

      try {
        const res = await apiClient.auth.verifyOtp(userIdentifier, otpCode);
        if (res && res.token) {
          const EXP_HOURS = 24;
          const expiresAt = Date.now() + EXP_HOURS * 60 * 60 * 1000;

          localStorage.setItem("vendor_token", res.token);
          localStorage.setItem("vendor_code", res.code);
          localStorage.setItem("vendor_token_exp", expiresAt);

          window.location.replace("/dashboard");
        } else {
          setStatus(res?.error || "Código incorrecto o expirado.");
        }
      } catch (error) {
        console.error("[auth error]", error);
        setStatus("Fallo de conexión al verificar el OTP.");
      } finally {
        btnVerify.disabled = false;
        btnVerify.textContent = "Verificar e Ingresar";
      }
    });
  }

  if (btnBack) {
    btnBack.addEventListener("click", () => {
      clearStatus();
      verifyForm.style.display = "none";
      reqForm.style.display = "flex";
    });
  }
});
