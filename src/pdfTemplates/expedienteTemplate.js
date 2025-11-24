export const generateExpedienteHTML = (expediente, logoUrl) => `
<html>
  <head>
    <style>
      body { font-family: Helvetica, sans-serif; padding: 40px; background: #f8f9fa; color: #2c3e50; }
      .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; margin-bottom: 20px; }
      .logo img { width: 120px; }
      h1 { text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 20px; }

      .section {
        margin-bottom: 18px;
        padding: 15px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        background: #fff;
      }
      .section-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .item { margin-bottom: 6px; }
      .label { font-weight: bold; color: #34495e; }

      .grid { display: flex; justify-content: space-between; }
      .grid .box {
        width: 48%;
        padding: 12px;
        background: #fff;
        border-radius: 8px;
        border: 1px solid #d1d5db;
        margin-bottom: 10px;
      }

      .footer {
        margin-top: 30px;
        text-align: center;
        font-size: 10px;
        color: #6b7280;
        border-top: 1px solid #e0e0e0;
        padding-top: 10px;
      }
    </style>
  </head>
  <body>

    <div class="header">
      <div class="logo">${logoUrl ? `<img src="${logoUrl}"/>` : ""}</div>
      <div class="clinic-info">
        <div><b>Clínica Salud Integral</b></div>
        <div>Av. Principal 123, Ciudad</div>
        <div>Tel: (123) 456-7890</div>
      </div>
    </div>

    <h1>Expediente Médico</h1>

    <div class="grid">
      <div class="box"><span class="label">Altura:</span> ${expediente.altura} m</div>
      <div class="box"><span class="label">Peso:</span> ${expediente.peso} kg</div>
      <div class="box"><span class="label">IMC:</span> ${expediente.bmi}</div>
      <div class="box"><span class="label">Tipo de sangre:</span> ${expediente.tipo_sangre}</div>
    </div>

    <div class="section">
      <div class="section-title">Signos Vitales</div>
      <div class="item"><span class="label">Temperatura:</span> ${expediente.temperatura} °C</div>
      <div class="item"><span class="label">Presión arterial:</span> ${expediente.presion_art}</div>
      <div class="item"><span class="label">Frec. respiratoria:</span> ${expediente.presion_resp} /min</div>
      <div class="item"><span class="label">Frec. cardíaca:</span> ${expediente.presion_card} bpm</div>
    </div>

    <div class="section">
      <div class="section-title">Antecedentes</div>
      <div>${expediente.antecedentes || "No registra antecedentes."}</div>
    </div>

    <div class="section">
      <div class="section-title">Alergias</div>
      <div>${expediente.alergias || "No registra alergias."}</div>
    </div>

    <div class="section">
      <div class="section-title">Enfermedades</div>
      <div>${expediente.enfermedades || "No registra enfermedades."}</div>
    </div>

    <div class="section">
      <div class="section-title">Medicamentos</div>
      <div>${expediente.medicamentos || "No hay medicamentos registrados."}</div>
    </div>

    <div class="section">
      <div class="section-title">Notas Médicas</div>
      <div>${expediente.notas || "No hay notas médicas."}</div>
    </div>

    <div class="footer">
      Documento generado automáticamente por el sistema. Para fines informativos.
    </div>

  </body>
</html>
`;

