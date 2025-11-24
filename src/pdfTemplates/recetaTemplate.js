export const generateRecetaHTML = (receta, logoUrl) => `
<html>
  <head>
    <style>
      body { font-family: Helvetica, sans-serif; padding: 40px; background: #f8f9fa; color: #2c3e50; }
      .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; margin-bottom: 20px; }
      .logo { font-size: 18px; font-weight: bold; }
      .clinic-info { font-size: 10px; text-align: right; color: #34495e; }
      h1 { text-align: center; font-size: 20px; font-weight: bold; text-transform: uppercase; margin-bottom: 20px; }
      .section { margin-bottom: 20px; padding: 15px; border: 1px solid #d1d5db; border-radius: 5px; background: #fff; }
      .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
      .label { font-weight: bold; width: 30%; color: #34495e; }
      .value { width: 70%; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; }
      th { background-color: #e9ecef; font-weight: bold; }
      .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #6b7280; border-top: 1px solid #e0e0e0; padding-top: 10px; }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="logo">${logoUrl ? `<img src="${logoUrl}" width="100" />` : "[Logo Clínica]"}</div>
      <div class="clinic-info">
        <div>Clínica Salud Integral</div>
        <div>Av. Principal 123, Ciudad, País</div>
        <div>Tel: (123) 456-7890</div>
      </div>
    </div>

    <h1>Receta Médica</h1>

    <div class="section">
      <div class="info-row"><span class="label">Paciente:</span><span class="value">${receta.paciente}</span></div>
      <div class="info-row"><span class="label">Doctor:</span><span class="value">${receta.doctor}</span></div>
      <div class="info-row"><span class="label">Estado:</span><span class="value">${receta.estado === 0 ? "Pendiente" : "Completado"}</span></div>
      <div class="info-row"><span class="label">Fecha inicio:</span><span class="value">${new Date(receta.fecha_inicio).toLocaleDateString()}</span></div>
      <div class="info-row"><span class="label">Fecha fin:</span><span class="value">${new Date(receta.fecha_fin).toLocaleDateString()}</span></div>
    </div>

    <div class="section">
      <table>
        <thead>
          <tr>
            <th>Medicamento</th>
            <th>Dosis</th>
            <th>Instrucciones</th>
          </tr>
        </thead>
        <tbody>
          ${receta.medicamentos.map(med => `
            <tr>
              <td>${med.medicamento}</td>
              <td>${med.dosis}</td>
              <td>${med.instrucciones}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="footer">
      Nota: Este documento es válido solo con la firma del médico. Consulte a su médico antes de suspender el tratamiento.
    </div>
  </body>
</html>
`;