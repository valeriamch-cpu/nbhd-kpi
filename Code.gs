// ============================================================
// APPS SCRIPT — KPIs NBHD/PYN
// Pegar en: Extensions > Apps Script del Google Sheet
// Luego: Deploy > New deployment > Web App
//   - Execute as: Me
//   - Who has access: Anyone
// Copiar la URL del deployment y pegarla en index.html (SCRIPT_URL)
// ============================================================

const SHEET_NAME = 'KPIs';

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const cors = ContentService.createTextOutput();

  try {
    const params = e.parameter;
    const action = params.action;
    let result;

    if (action === 'getAll') {
      result = getAllKPIs();
    } else if (action === 'save') {
      const data = JSON.parse(params.data);
      result = saveKPI(data);
    } else if (action === 'delete') {
      result = deleteKPI(params.id);
    } else if (action === 'updateProgress') {
      result = updateProgress(params.id, parseFloat(params.current));
    } else {
      result = { error: 'Acción desconocida' };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Crear encabezados
    const headers = ['ID','Nombre','Marca','Area','Responsable','Periodo','Meta','Actual','Unidad','Descripcion','Tendencia','Historia','FechaCreacion','FechaActualizacion'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);

    // Datos de ejemplo
    const ejemplos = [
      [1,'Ventas mensuales','NBHD','Ventas','Valeria','Q2 2026',3500000,2870000,'ARS','Meta de ventas totales en tienda',8.2,'60,68,72,75,82',new Date(),new Date()],
      [2,'Ventas online PYN','PYN','E-commerce','Sandra','Q2 2026',1200000,510000,'ARS','Facturación en Tienda Nube PYN',3.1,'20,28,32,38,43',new Date(),new Date()],
      [3,'Tickets atendidos','AMBAS','Atención al cliente','Valentina','Q2 2026',300,278,'tickets','Consultas respondidas por mes',-2.0,'70,80,82,88,93',new Date(),new Date()],
      [4,'Nuevos proveedores','NBHD','Compras','Willy','Q2 2026',8,3,'prov.','Alta de nuevos proveedores',0,'0,13,25,38',new Date(),new Date()],
      [5,'Costo por adquisición','PYN','Marketing','Teresita','Q2 2026',1500,1820,'ARS/cliente','CPA campañas Meta Ads',12.1,'90,95,100,105,121',new Date(),new Date()],
      [6,'NPS Clientes','AMBAS','Ventas','Valeria','Q2 2026',75,71,'puntos','Net Promoter Score encuestas',-1.5,'85,90,92,94,95',new Date(),new Date()],
      [7,'Facturación NBHD','NBHD','Finanzas','Veronica','Q2 2026',12000000,9800000,'ARS','Facturación bruta trimestral',5.4,'55,65,70,78,82',new Date(),new Date()],
      [8,'Margen bruto','AMBAS','Finanzas','Pedro','Q2 2026',55,52.3,'%','Margen bruto sobre ventas',-0.8,'90,92,93,94,95',new Date(),new Date()],
      [9,'Seguidores IG PYN','PYN','Marketing','Teresita','Q2 2026',15000,14200,'seguidores','Crecimiento comunidad Instagram',4.2,'80,85,88,92,95',new Date(),new Date()],
      [10,'Órdenes despachadas','NBHD','Operaciones','Willy','Q2 2026',500,500,'pedidos','Órdenes enviadas en el período',1.0,'80,85,90,95,100',new Date(),new Date()],
    ];
    sheet.getRange(2, 1, ejemplos.length, ejemplos[0].length).setValues(ejemplos);
  }

  return sheet;
}

function getAllKPIs() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { kpis: [] };

  const headers = data[0];
  const kpis = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    // Parsear historia como array
    if (typeof obj.Historia === 'string') {
      obj.Historia = obj.Historia.split(',').map(Number).filter(n => !isNaN(n));
    }
    return obj;
  });

  return { kpis };
}

function saveKPI(data) {
  const sheet = getSheet();
  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];

  const now = new Date();

  if (data.ID) {
    // Actualizar existente
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][0] == data.ID) {
        const row = i + 1;
        sheet.getRange(row, 1, 1, headers.length).setValues([[
          data.ID,
          data.Nombre,
          data.Marca,
          data.Area,
          data.Responsable,
          data.Periodo,
          data.Meta,
          data.Actual,
          data.Unidad,
          data.Descripcion || '',
          data.Tendencia || 0,
          Array.isArray(data.Historia) ? data.Historia.join(',') : data.Historia || '',
          allData[i][12], // mantener fecha creación
          now
        ]]);
        return { success: true, action: 'updated', id: data.ID };
      }
    }
  }

  // Crear nuevo
  const maxId = allData.slice(1).reduce((max, row) => Math.max(max, row[0] || 0), 0);
  const newId = maxId + 1;
  sheet.appendRow([
    newId,
    data.Nombre,
    data.Marca,
    data.Area,
    data.Responsable,
    data.Periodo,
    data.Meta,
    data.Actual,
    data.Unidad,
    data.Descripcion || '',
    0,
    '',
    now,
    now
  ]);

  return { success: true, action: 'created', id: newId };
}

function deleteKPI(id) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { error: 'KPI no encontrado' };
}

function updateProgress(id, current) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const actualCol = headers.indexOf('Actual') + 1;
  const fechaCol = headers.indexOf('FechaActualizacion') + 1;
  const historiaCol = headers.indexOf('Historia') + 1;
  const metaCol = headers.indexOf('Meta') + 1;

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      const row = i + 1;
      const meta = data[i][metaCol - 1];
      const pct = Math.min(Math.round((current / meta) * 100), 100);

      // Actualizar historial
      let hist = (data[i][historiaCol - 1] || '').toString().split(',').map(Number).filter(n => !isNaN(n));
      hist.push(pct);
      if (hist.length > 8) hist = hist.slice(-8);

      sheet.getRange(row, actualCol).setValue(current);
      sheet.getRange(row, fechaCol).setValue(new Date());
      sheet.getRange(row, historiaCol).setValue(hist.join(','));

      return { success: true };
    }
  }
  return { error: 'KPI no encontrado' };
}
