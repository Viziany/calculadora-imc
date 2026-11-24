// ============ Referencias del DOM ============
const form       = document.getElementById("imc-form");
const inputPeso  = document.getElementById("peso");
const inputEst   = document.getElementById("estatura");
const errPeso    = document.querySelector('[data-error-for="peso"]');
const errEst     = document.querySelector('[data-error-for="estatura"]');

const panel       = document.getElementById("resultado");
const spanNumero  = document.getElementById("imc-numero");
const spanCat     = document.getElementById("imc-categoria");
const spanConsejo = document.getElementById("imc-consejo");
const btnReset    = document.getElementById("btn-reset");

// ============ Validación por campo ============
function validarPeso(valor) {
  if (valor === "" || valor === null) return "El peso es obligatorio.";
  if (!/^\d*\.?\d+$/.test(valor))     return "El peso solo admite números.";
  const n = parseFloat(valor);
  if (isNaN(n))           return "Ingresa un número válido.";
  if (n <= 0)             return "El peso debe ser mayor que 0 kg.";
  if (n < 1)              return "El peso mínimo aceptado es 1 kg.";
  if (n > 300)            return "El peso máximo aceptado es 300 kg.";
  return "";
}

function validarEstatura(valor) {
  if (valor === "" || valor === null) return "La estatura es obligatoria.";
  if (!/^\d*\.?\d+$/.test(valor))     return "La estatura solo admite números.";
  const n = parseFloat(valor);
  if (isNaN(n))           return "Ingresa un número válido.";
  if (n <= 0)             return "La estatura debe ser mayor que 0 m.";
  if (n < 0.5)            return "La estatura mínima aceptada es 0.5 m.";
  if (n > 2.5)              return "La estatura máxima aceptada es 2.5 m.";
  return "";
}

function pintarError(input, small, mensaje) {
  if (mensaje) {
    input.classList.add("invalid");
    small.textContent = mensaje;
  } else {
    input.classList.remove("invalid");
    small.textContent = "";
  }
}

// ============ Lógica del IMC ============
function clasificarIMC(imc) {
  if (imc < 18.5) return {
    etiqueta: "Bajo peso",
    clase: "bajo",
    consejo: "Tu peso está por debajo de lo saludable. Considera una dieta equilibrada y consulta a un especialista."
  };
  if (imc < 25)   return {
    etiqueta: "Peso saludable",
    clase: "saludable",
    consejo: "¡Excelente! Mantén tus hábitos de alimentación y actividad física."
  };
  if (imc < 30)   return {
    etiqueta: "Sobrepeso",
    clase: "sobrepeso",
    consejo: "Estás por encima de lo saludable. Aumenta la actividad física y cuida tu alimentación."
  };
  return {
    etiqueta: "Obesidad",
    clase: "obesidad",
    consejo: "Tu IMC indica obesidad. Se recomienda acudir con un profesional de la salud."
  };
}

function calcularIMC(peso, estatura) {
  return peso / (estatura * estatura);
}

// ============ Validación en tiempo ============
inputPeso.addEventListener("input", () => {
  // Restringe caracteres no numéricos al escribir
  inputPeso.value = inputPeso.value.replace(/[^0-9.]/g, "");
  // Evita múltiples puntos
  const partes = inputPeso.value.split(".");
  if (partes.length > 2) inputPeso.value = partes[0] + "." + partes.slice(1).join("");

  pintarError(inputPeso, errPeso, validarPeso(inputPeso.value));
});

inputEst.addEventListener("input", () => {
  inputEst.value = inputEst.value.replace(/[^0-9.]/g, "");
  const partes = inputEst.value.split(".");
  if (partes.length > 2) inputEst.value = partes[0] + "." + partes.slice(1).join("");

  pintarError(inputEst, errEst, validarEstatura(inputEst.value));
});

// ============ Envío del formulario ============
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const msgPeso = validarPeso(inputPeso.value);
  const msgEst  = validarEstatura(inputEst.value);

  pintarError(inputPeso, errPeso, msgPeso);
  pintarError(inputEst,  errEst,  msgEst);

  if (msgPeso || msgEst) {
    panel.classList.add("hidden");
    // Enfoca el primer campo con error
    (msgPeso ? inputPeso : inputEst).focus();
    return;
  }

  const peso = parseFloat(inputPeso.value);
  const estatura = parseFloat(inputEst.value);
  const imc = calcularIMC(peso, estatura);
  const { etiqueta, clase, consejo } = clasificarIMC(imc);

  spanNumero.textContent = imc.toFixed(2);
  spanCat.textContent    = etiqueta;
  spanConsejo.textContent = consejo;

  panel.classList.remove("hidden", "bajo", "saludable", "sobrepeso", "obesidad");
  panel.classList.add(clase);

  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

// ============ Botón limpiar ============
btnReset.addEventListener("click", () => {
  pintarError(inputPeso, errPeso, "");
  pintarError(inputEst,  errEst,  "");
  panel.classList.add("hidden");
  panel.classList.remove("bajo", "saludable", "sobrepeso", "obesidad");
});