document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".form-step");
  const stepIndicators = document.querySelectorAll(".steps .step");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const projectForm = document.getElementById("projectForm");

  let currentStep = 0;

  // Wallet/account
  let currentAccount;

  async function getAccount() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      currentAccount = accounts[0];
    }
  }

  // --------------------
  // Multi-step form
  // --------------------
  function showStep(step) {
    steps.forEach((el, i) => el.classList.toggle("active", i === step));
    stepIndicators.forEach((el, i) => el.classList.toggle("active", i <= step));

    prevBtn.style.display = step === 0 ? "none" : "inline-block";
    nextBtn.textContent = step === steps.length - 1 ? "Finish" : "Next";

    if (step === 2 && window.map) {
      setTimeout(() => window.map.invalidateSize(), 300);
    }
  }

  nextBtn.addEventListener("click", async () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);

      if (currentStep === steps.length - 1) {
        // On final step → submit project after a short delay
        await submitProject();
      }
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });

  showStep(currentStep);

  // --------------------
  // Signature Pad
  // --------------------
  const canvas = document.getElementById("signaturePad");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let drawing = false;

    function startPosition(e) { drawing = true; draw(e); }
    function endPosition() { drawing = false; ctx.beginPath(); }

    function draw(e) {
      if (!drawing) return;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
      const y = e.clientY ? e.clientY - rect.top : e.touches[0].clientY - rect.top;

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", endPosition);
    canvas.addEventListener("mousemove", draw);

    canvas.addEventListener("touchstart", startPosition);
    canvas.addEventListener("touchend", endPosition);
    canvas.addEventListener("touchmove", draw);

    document.getElementById("clearSignature").addEventListener("click", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  // --------------------
  // Leaflet Map & Draw
  // --------------------
  const mapElement = document.getElementById("map");
  let drawnItems = new L.FeatureGroup();
  let map;

  if (mapElement) {
    map = L.map("map").setView([12.8195, 80.0441], 15);
    window.map = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      edit: { featureGroup: drawnItems },
      draw: { polygon: true, rectangle: true, circle: false, marker: false, polyline: false }
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function (e) {
      drawnItems.clearLayers();
      const layer = e.layer;
      drawnItems.addLayer(layer);

      const geojson = layer.toGeoJSON();
      document.getElementById("boundaryCoords").value = JSON.stringify(geojson.geometry.coordinates);
    });
  }

  // --------------------
  // Submit Project
  // --------------------
  async function submitProject() {
    await getAccount();

    const formData = new FormData(projectForm);
    const name = formData.get("projectName");
    const description = formData.get("projectDescription");
    const address = formData.get("projectAddress");
    const startDate = formData.get("startDate");
    const boundary = formData.get("boundary");

    if (!name || !description || !address || !startDate || !boundary) {
      alert("Please complete all required fields.");
      return;
    }

    // Optional: calculate area in hectares using Turf.js
    let areaHa = 1; // default 1 ha
    try {
      const geojson = drawnItems.toGeoJSON();
      if (geojson.features.length > 0) {
        // Using Turf.js if available
        if (window.turf) {
          areaHa = turf.area(geojson.features[0]) / 10000; // m² → ha
        }
      }
    } catch (err) {
      console.warn("Error calculating area:", err);
    }

    // Mock CO₂ offset (e.g., 10 t per ha)
    const co2Offset = areaHa * 10;

    const projectData = {
      user: currentAccount,
      name,
      description,
      address,
      startDate,
      boundary,
      area: areaHa,
      co2Offset
    };

    try {
      const res = await fetch("http://localhost:5000/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData)
      });

      const result = await res.json();
      console.log("Project created:", result);

      // Show success step
      currentStep++;
      showStep(currentStep);

      // Redirect to dashboard after 3s
      setTimeout(() => window.location.href = "dashboard.html", 3000);
    } catch (err) {
      console.error("Error creating project:", err);
      alert("Failed to create project. Check console.");
    }
  }
});
