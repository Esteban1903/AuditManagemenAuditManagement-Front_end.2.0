document.addEventListener('DOMContentLoaded', () => {
    let sectores = [
      { id: 1, nombre: 'Recursos Humanos' },
      { id: 2, nombre: 'Marketing' }
    ];
    let idContador = 3;
    let idSectorEditando = null;
  
    // =========================
    // Vistas (manejo unificado)
    // =========================
    const secciones = document.querySelectorAll('.seccion');
    const enlaces = document.querySelectorAll('nav ul li a[data-seccion]');
  
    enlaces.forEach(enlace => {
      enlace.addEventListener('click', e => {
        e.preventDefault();
        enlaces.forEach(l => l.classList.remove('activo'));
        enlace.classList.add('activo');
        const id = enlace.dataset.seccion;
        mostrarVista(id);
      });
    });
  
    function mostrarVista(idVista) {
      secciones.forEach(sec => sec.classList.remove('activa'));
      const vista = document.getElementById(idVista);
      if (vista) {
        vista.classList.add('activa');
      }
    }
  
    // =========================
    // Elementos de la interfaz
    // =========================
    const tbodyPrincipal = document.getElementById('tabla-principal-body');
    const inputBusqueda = document.getElementById('input-busqueda');
  
    // Agregar
    const btnAgregar = document.getElementById('btn-agregar');
    const btnGuardar = document.getElementById('btn-guardar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const inputNuevoSector = document.getElementById('input-nuevo-sector');
  
    // Editar
    const inputEditarSector = document.getElementById('input-editar-sector');
    const btnGuardarEdicion = document.getElementById('btn-guardar-edicion');
    const btnCancelarEdicion = document.getElementById('btn-cancelar-edicion');
  
    // Buscar
    const btnBuscar = document.getElementById('btn-buscar');
  
    // =========================
    // Eventos Sectores
    // =========================
    btnAgregar.addEventListener('click', () => {
      inputNuevoSector.value = '';
      mostrarVista('vista-agregar-sector');
    });
  
    btnCancelar.addEventListener('click', () => {
      mostrarVista('procesos');
    });
  
    btnGuardar.addEventListener('click', () => {
      const nombre = inputNuevoSector.value.trim();
      const nombreValido = /^[a-zA-Z\s]+$/.test(nombre);
  
      if (!nombreValido) {
        Swal.fire({
          title: 'Nombre inválido',
          text: 'Por favor ingresa un nombre válido para el sector (solo letras y espacios).',
          icon: 'error',
          confirmButtonColor: '#1f3556',
        });
        return;
      }
  
      const existeSector = sectores.some(s => s.nombre.toLowerCase() === nombre.toLowerCase());
      if (existeSector) {
        Swal.fire({
          title: 'Sector duplicado',
          text: 'Ya existe un sector con este nombre.',
          icon: 'warning',
          confirmButtonColor: '#1f3556',
        });
        return;
      }
  
      if (nombre !== '') {
        sectores.push({ id: idContador++, nombre });
        renderTabla(inputBusqueda.value.trim().toLowerCase());
        mostrarVista('procesos');
      } else {
        Swal.fire({
          title: 'Nombre vacío',
          text: 'Por favor ingresa un nombre válido para el sector.',
          icon: 'error',
          confirmButtonColor: '#1f3556',
        });
      }
    });
  
    btnGuardarEdicion.addEventListener('click', () => {
      const nuevoNombre = inputEditarSector.value.trim();
      const nombreValido = /^[a-zA-Z\s]+$/.test(nuevoNombre);
  
      if (!nombreValido) {
        Swal.fire({
          title: 'Nombre inválido',
          text: 'Por favor ingresa un nombre válido para el sector (solo letras y espacios).',
          icon: 'error',
          confirmButtonColor: '#1f3556',
        });
        return;
      }
  
      const existeSector = sectores.some(s => s.nombre.toLowerCase() === nuevoNombre.toLowerCase() && s.id !== idSectorEditando);
      if (existeSector) {
        Swal.fire({
          title: 'Sector duplicado',
          text: 'Ya existe un sector con este nombre.',
          icon: 'warning',
          confirmButtonColor: '#1f3556',
        });
        return;
      }
  
      if (nuevoNombre !== '' && idSectorEditando !== null) {
        const sector = sectores.find(s => s.id === idSectorEditando);
        if (sector) {
          sector.nombre = nuevoNombre;
          renderTabla(inputBusqueda.value.trim().toLowerCase());
        }
        idSectorEditando = null;
        mostrarVista('procesos');
      } else {
        Swal.fire({
          title: 'Nombre vacío',
          text: 'Por favor ingresa un nombre válido para el sector.',
          icon: 'error',
          confirmButtonColor: '#1f3556',
        });
      }
    });
  
    btnBuscar.addEventListener('click', () => {
      renderTabla(inputBusqueda.value.trim().toLowerCase());
    });
  
    inputBusqueda.addEventListener('input', () => {
      renderTabla(inputBusqueda.value.trim().toLowerCase());
    });
  
    btnCancelarEdicion.addEventListener('click', () => {
      idSectorEditando = null;
      mostrarVista('procesos');
    });
  
    btnGuardarEdicion.addEventListener('click', () => {
      const nuevoNombre = inputEditarSector.value.trim();
      if (nuevoNombre !== '' && idSectorEditando !== null) {
        const sector = sectores.find(s => s.id === idSectorEditando);
        if (sector) {
          sector.nombre = nuevoNombre;
          renderTabla(inputBusqueda.value.trim().toLowerCase());
        }
        idSectorEditando = null;
        mostrarVista('procesos');
      } else {
        alert('Por favor ingresa un nombre válido para el sector.');
      }
    });
  
    function renderTabla(filtro = '') {
      tbodyPrincipal.innerHTML = '';
      sectores
        .filter(s => s.nombre.toLowerCase().includes(filtro))
        .forEach(s => {
          const fila = document.createElement('tr');
          fila.innerHTML = `
            <td class="fila-tabla">${s.nombre}</td>
            <td class="columna-acciones">
              <button class="btn-editar" data-id="${s.id}">Editar</button>
              <button class="btn-eliminar" data-id="${s.id}">Eliminar</button>
            </td>
          `;
          tbodyPrincipal.appendChild(fila);
        });
  
      document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.dataset.id);
          const sector = sectores.find(s => s.id === id);
  
          Swal.fire({
            title: `¿Eliminar "${sector.nombre}"?`,
            text: "¡No podrás deshacer esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1f3556',
            cancelButtonColor: '#d32f2f',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              sectores = sectores.filter(s => s.id !== id);
              renderTabla(inputBusqueda.value.trim().toLowerCase());
  
              Swal.fire({
                title: 'Eliminado',
                text: 'El sector ha sido eliminado correctamente.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
              });
            }
          });
        });
      });
  
      document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.dataset.id);
          const sector = sectores.find(s => s.id === id);
          if (sector) {
            idSectorEditando = id;
            inputEditarSector.value = sector.nombre;
            mostrarVista('vista-editar-sector');
          }
        });
      });
    }
  
    // Inicial
    renderTabla();
  
    // =========================
    // Planes de Auditoría
    // =========================
    const btnAgregarAuditoria = document.querySelector(".btn-agregar-auditoria");
    const btnCancelarAuditoria = document.querySelector(".btn-cancelar-auditoria");
    const formAuditoria = document.getElementById("form-auditoria");
  
    btnAgregarAuditoria.addEventListener("click", () => {
      formAuditoria.style.display = formAuditoria.style.display === "none" ? "block" : "none";
    });
  
    btnCancelarAuditoria.addEventListener("click", () => {
      formAuditoria.style.display = "none";
      formAuditoria.reset();
    });
  
    function crearBotonesAcciones(fila) {
      const td = document.createElement("td");
  
      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.classList.add("btn-editar");
  
      btnEditar.addEventListener("click", () => {
        const celdas = fila.querySelectorAll("td");
        const campos = [
          "tipo", "subtipo", "auditoria", "proceso", "lider_proceso",
          "personal_a_auditar", "lider_auditor", "auditor", "estado", "fecha"
        ];
  
        campos.forEach((campo, i) => {
          formAuditoria[campo].value = celdas[i].innerText.replace(/\n/g, "\n");
        });
  
        formAuditoria.style.display = "block";
        fila.remove();
      });
  
      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.classList.add("btn-eliminar");
      btnEliminar.style.marginLeft = "8px";
  
      btnEliminar.addEventListener("click", () => {
        Swal.fire({
          title: '¿Eliminar auditoría?',
          text: "Esta acción no se puede deshacer.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#1f3556',
          cancelButtonColor: '#d32f2f',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            fila.remove();
            Swal.fire({
              title: 'Eliminado',
              text: 'La auditoría ha sido eliminada correctamente.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          }
        });
      });
  
      td.appendChild(btnEditar);
      td.appendChild(btnEliminar);
      fila.appendChild(td);
    }
  
    formAuditoria.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const fechaSeleccionada = new Date(this.fecha.value);
      const fechaActual = new Date();
      fechaActual.setHours(0, 0, 0, 0); // Eliminar la hora para comparar solo la fecha
  
      const fechaMaxima = new Date();
      fechaMaxima.setFullYear(fechaMaxima.getFullYear() + 1); // Permitir hasta un año en el futuro
  
      if (fechaSeleccionada < fechaActual) {
        Swal.fire({
          title: 'Fecha inválida',
          text: 'Por favor selecciona una fecha posterior o igual al día actual.',
          icon: 'error',
          confirmButtonColor: '#1f3556',
        });
        return;
      }
  
      if (fechaSeleccionada > fechaMaxima) {
        Swal.fire({
          title: 'Fecha inválida',
          text: 'Por favor selecciona una fecha no mayor a un año desde hoy.',
          icon: 'error',
          confirmButtonColor: '#1f3556',
        });
        return;
      }
  
      const nuevaFila = document.createElement("tr");
  
      const datos = [
        this.tipo.value,
        this.subtipo.value,
        this.auditoria.value,
        this.proceso.value,
        this.lider_proceso.value,
        this.personal_a_auditar.value,
        this.lider_auditor.value,
        this.auditor.value,
        this.estado.value,
        this.fecha.value,
      ];
  
      datos.forEach(texto => {
        const td = document.createElement("td");
        td.innerHTML = texto.replace(/\n/g, "<br>");
        nuevaFila.appendChild(td);
      });
  
      crearBotonesAcciones(nuevaFila);
      document.querySelector(".tabla-auditoria tbody").appendChild(nuevaFila);
      this.reset();
      this.style.display = "none";
    });
  
    // Añadir botones a filas existentes
    document.querySelectorAll(".tabla-auditoria tbody tr").forEach(fila => {
      crearBotonesAcciones(fila);
    });
  
    // =========================
    // Ajustar alineación de tabla
    // =========================
    const tablaAuditoria = document.querySelector(".tabla-auditoria");
    const ajustarAlineacion = () => {
      const headers = tablaAuditoria.querySelectorAll("thead th");
      const filas = tablaAuditoria.querySelectorAll("tbody tr");
  
      filas.forEach(fila => {
        const celdas = fila.querySelectorAll("td");
        celdas.forEach((celda, index) => {
          celda.style.minWidth = `${headers[index].offsetWidth}px`;
        });
      });
    };
  
    window.addEventListener("resize", ajustarAlineacion);
    ajustarAlineacion();
  });
    // ==== FUNCIONALIDAD: Formulario de trabajadores ====
  const formTrabajador = document.querySelector("#trabajadores .formulario");
  const tbodyTrabajadores = document.getElementById("tbody-trabajadores");
  const tablaContainer = document.getElementById("contenedor-tabla-trabajadores");
  
  formTrabajador.addEventListener("submit", (e) => {
    e.preventDefault();
  
    const [nombre, id, celular, correo, sectorSelect] = formTrabajador.querySelectorAll("input, select");
    const sector = sectorSelect.options[sectorSelect.selectedIndex].text;
  
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${nombre.value}</td>
      <td>${id.value}</td>
      <td>${celular.value}</td>
      <td>${correo.value}</td>
      <td>${sector}</td>
      <td>
        <button class="btn-editar">Editar</button>
        <button class="btn-eliminar">Eliminar</button>
      </td>
    `;
  
    // Evento eliminar
    fila.querySelector(".btn-eliminar").addEventListener("click", () => {
      Swal.fire({
        title: '¿Eliminar trabajador?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1f3556',
        cancelButtonColor: '#d32f2f',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          fila.remove();
          Swal.fire({
            title: 'Eliminado',
            text: 'El trabajador ha sido eliminado correctamente.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        }
      });
    });
  
  
    // Evento editar
    fila.querySelector(".btn-editar").addEventListener("click", () => {
      nombre.value = fila.children[0].innerText;
      id.value = fila.children[1].innerText;
      celular.value = fila.children[2].innerText;
      correo.value = fila.children[3].innerText;
      sectorSelect.value = sector;
      fila.remove();
    });
  
    tbodyTrabajadores.appendChild(fila);
    tablaContainer.style.display = "block";
    formTrabajador.reset();
  });
  
  // ==== FUNCIONALIDAD: Buscador en tiempo real ====
  const inputBusqueda = document.getElementById("busqueda-trabajador");
  
  inputBusqueda.addEventListener("input", () => {
    const filtro = inputBusqueda.value.toLowerCase();
    const filas = tbodyTrabajadores.querySelectorAll("tr");
  
    filas.forEach(fila => {
      const nombre = fila.children[0].innerText.toLowerCase();
      const identificacion = fila.children[1].innerText.toLowerCase();
      const coincide = nombre.includes(filtro) || identificacion.includes(filtro);
      fila.style.display = coincide ? "" : "none";
    });
  });
  
    