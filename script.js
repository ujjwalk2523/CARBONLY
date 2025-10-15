
// Example JS (optional)
// You can add interactivity here later

document.querySelectorAll(".buttons button").forEach(btn => {
  btn.addEventListener("click", () => {
    alert("Button clicked: " + btn.textContent);
  });
});
const arrow = document.querySelector('.arrow');
const whySection = document.getElementById('why-section');

function checkArrowPosition() {
  const arrowRect = arrow.getBoundingClientRect();
  const whyRect = whySection.getBoundingClientRect();

  // Check if arrow's center has reached top of Why section
  const arrowCenterY = arrowRect.top + arrowRect.height / 2;

  if (arrowCenterY >= whyRect.top) {
    arrow.style.opacity = 0; // hide arrow
  } else {
    arrow.style.opacity = 1; // show arrow
  }

  requestAnimationFrame(checkArrowPosition);
}

// Start the loop
document.addEventListener("DOMContentLoaded", () => {
  const timeline = document.querySelector('.timeline');
  const progressIndicator = document.querySelector('.progress-indicator');

  if (timeline && progressIndicator) {
    window.addEventListener('scroll', () => {
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // progress based on how much of the timeline has been scrolled through
      let progress = (windowHeight - rect.top) / (rect.height + windowHeight);

      // clamp strictly between 0 and 1
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      // apply
      progressIndicator.style.top = `${progress * 100}%`;
    });
  }
});


// Contact form submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // prevent reload
      alert("Thank you! Your message has been submitted.");
      form.reset();
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const sendBtn = document.getElementById("send-btn");
  const statusP = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      // Disable button while sending
      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.textContent = "Sending...";
      }
      if (statusP) { statusP.textContent = ""; }

      // Send email using EmailJS
      emailjs.sendForm("service_5am9okm", "template_u9g1c1m", this)
        .then(function() {
          if (statusP) {
            statusP.style.color = "green";
            statusP.textContent = "✅ Message sent — thank you!";
          } else {
            alert("✅ Message sent — thank you!");
          }
          form.reset();
        }, function(error) {
          console.error("EmailJS error:", error);
          if (statusP) {
            statusP.style.color = "red";
            statusP.textContent = "❌ Failed to send. Please try again later.";
          } else {
            alert("❌ Failed to send. Please try again.");
          }
        })
        .finally(() => {
          if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.textContent = "Send Message";
          }
        });
    });
  }
});
// ---------------- Blockchain: CarbonToken ----------------
let provider, signer, contract;

async function initBlockchain() {
  // MetaMask provider
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // request wallet connect
    signer = await provider.getSigner();

    // Load ABI & Address
    const response = await fetch("CarbonToken.json");
    const artifact = await response.json();
    const abi = artifact.abi;
    
    // ⚠️ Replace this with the address shown when you deployed (localhost)
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // Init contract
    contract = new ethers.Contract(contractAddress, abi, signer);

    console.log("Connected to CarbonToken:", contract);
  } else {
    alert("Please install MetaMask to use this dApp!");
  }
}

// Example: show token name in console
async function showTokenName() {
  if (contract) {
    const name = await contract.name();
    console.log("Token name:", name);
  }
}

// Auto-init on page load
document.addEventListener("DOMContentLoaded", initBlockchain);
document.addEventListener("DOMContentLoaded", () => {
  const connectBtn = document.getElementById("connect-wallet");
  const status = document.getElementById("wallet-status");

  // Show button only if user is logged in
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    connectBtn.style.display = "block";
  }

  connectBtn?.addEventListener("click", async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected! Please install it.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      status.textContent = `Connected: ${walletAddress}`;
      console.log("Wallet connected:", walletAddress);
    } catch (err) {
      console.error(err);
      alert("Failed to connect wallet.");
    }
  });
});
