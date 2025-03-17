// A function to get the current date in a formatted string
export const getFormattedDate = (): string => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// // Generate a unique quotation number
// export const generateQuotationNumber = (): string => {
//   const date = new Date();
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   const random = Math.floor(Math.random() * 1000)
//     .toString()
//     .padStart(3, "0");

//   return `Q-${year}${month}${day}-${random}`;
// };

// Add currency to the QuotationData interface
export interface QuotationData {
  clientName: string;
  clientEmail: string;
  clientPhoneNumber: string;
  projectName: string;
  projectOverview: string;
  developmentAreas: string[];
  seniorDevelopers: number;
  juniorDevelopers: number;
  uiUxDesigners: number;
  currency: "INR" | "USD";
}

// Update the generateQuotationHtml function to handle both currencies
export const generateQuotationHtml = (formData: QuotationData): string => {
  // Define base rates in INR
  const baseRates = {
    seniorDevRate: 75000,
    juniorDevRate: 30000,
    uiUxRate: 8000,
    projectManagementCost: 50000,
  };

  // Apply conversion if USD is selected (4% of INR value)
  const conversionRate = formData.currency === "USD" ? 0.04 : 1;
  const currencySymbol = formData.currency === "USD" ? "$" : "₹";

  // Calculate rates with conversion
  const seniorDevRate =
    75000 + Math.round(baseRates.seniorDevRate * conversionRate);
  const juniorDevRate =
    30000 + Math.round(baseRates.juniorDevRate * conversionRate);
  const uiUxRate = 8000 + Math.round(baseRates.uiUxRate * conversionRate);
  const projectManagementCost =
    50000 + Math.round(baseRates.projectManagementCost * conversionRate);

  // Calculate costs
  const seniorDevCost = formData.seniorDevelopers * seniorDevRate;
  const juniorDevCost = formData.juniorDevelopers * juniorDevRate;
  const uiUxCost = formData.uiUxDesigners * uiUxRate;
  const totalCost =
    seniorDevCost + juniorDevCost + uiUxCost + projectManagementCost;

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${currencySymbol} ${amount.toLocaleString(
      formData.currency === "INR" ? "en-IN" : "en-US"
    )}`;
  };

  const currentDate = getFormattedDate();

  // Update all currency symbols in the HTML template
  const quotationHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Project Quotation - CEHPOINT</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      :root {
        --quotation-dark: #1A1F2C;
        --quotation-yellow: #FFD700;
        --quotation-gray-light: #F5F5F7;
        --quotation-gray-medium: #E5E5E7;
        --quotation-dark-light: #4A5568;
      }
      
      body {
        font-family: 'Inter', sans-serif;
        line-height: 1.5;
        color: var(--quotation-dark);
        background-color: #F9FAFB;
        margin: 0;
        padding: 0;
      }
      
      .quotation-container {
        max-width: 800px;
      }
      
      .quotation-header {
        background: var(--quotation-dark);
        color: white;
        padding: 32px;
      }
      
      .quotation-tag {
        display: inline-block;
        background-color: var(--quotation-yellow);
        color: var(--quotation-dark);
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 12px;
        letter-spacing: 1px;
      }
      
      .company-contact-details {
        margin-top: 8px;
        color: rgba(255, 255, 255, 0.8);
      }
      
      .quotation-section-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--quotation-dark);
        position: relative;
        padding-left: 12px;
      }
      
      .quotation-section-title:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 4px;
        background-color: var(--quotation-yellow);
        border-radius: 2px;
      }
      
      .info-item {
        display: flex;
        margin-bottom: 16px;
      }
      
      .info-item svg {
        margin-right: 12px;
        flex-shrink: 0;
      }
      
      .info-label {
        color: var(--quotation-dark-light);
        font-size: 12px;
        margin-bottom: 2px;
      }
      
      .info-value {
        font-weight: 500;
      }
      
      /* Improved Table Styles */
      .quotation-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
      }
      
      .quotation-table th {
        background-color: var(--quotation-yellow);
        color: var(--quotation-dark);
        padding: 16px 20px;
        font-weight: 600;
        text-align: left;
      }
      
      .quotation-table th:first-child {
        border-top-left-radius: 8px;
      }
      
      .quotation-table th:last-child {
        border-top-right-radius: 8px;
      }
      
      .quotation-table td {
        padding: 16px 20px;
        border-bottom: 1px solid var(--quotation-gray-medium);
      }
      
      .quotation-table tr:last-child td {
        border-bottom: none;
      }
      
      .total-row {
        background-color: var(--quotation-gray-light);
        font-weight: 600;
      }
      
      .total-row td {
        padding: 20px !important;
      }
      
      .service-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: rgba(255, 215, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
      }
    </style>
  </head>
  <body>
    <div class="quotation-container">
      <!-- Header Section -->
      <div class="quotation-header">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <div class="quotation-tag" style="margin-right: 12px;">QUOTATION</div>
              <div class="quotation-tag">${formData.currency}</div>
            </div>
            <h1 style="font-size: 24px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 12px;">CEHPOINT</h1>
            <div class="company-contact-details" style="margin-top: 4px; line-height: 1.6;">
              <div style="display: flex; align-items: center;">
                <span style="margin-right: 8px;">●</span>
                <span>services.cehpoint.co.in</span>
              </div>
              <div style="display: flex; align-items: center;">
                <span style="margin-right: 8px;">●</span>
                <span>info@cehpoint.co.in</span>
              </div>
              <div style="display: flex; align-items: center;">
                <span style="margin-right: 8px;">●</span>
                <span>Corporate number (IVR): +91 33 6902 9331</span>
              </div>
            </div>
          </div>
          <div style="text-align: right;">
            <p style="opacity: 0.8; margin-top: 8px;">Date: ${currentDate}</p>
          </div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 32px; background-color: white;">
        <!-- Client Information Section -->
        <div>
          <h3 class="quotation-section-title" style="margin-bottom: 16px;">Client Information</h3>
          <div style="background-color: rgba(245, 245, 247, 0.5); border-radius: 12px; padding: 20px;">
            <div class="info-item">
              <span style="margin-right: 12px; color: var(--quotation-dark-light);">●</span>
              <div>
                <span class="info-label">Name</span>
                <p class="info-value" style="margin: 0;">${
                  formData.clientName
                }</p>
              </div>
            </div>
            <div class="info-item">
              <span style="margin-right: 12px; color: var(--quotation-dark-light);">●</span>
              <div>
                <span class="info-label">Email</span>
                <p class="info-value" style="margin: 0;">${
                  formData.clientEmail
                }</p>
              </div>
            </div>
            <div class="info-item">
              <span style="margin-right: 12px; color: var(--quotation-dark-light);">●</span>
              <div>
                <span class="info-label">Phone</span>
                <p class="info-value" style="margin: 0;">${
                  formData.clientPhoneNumber
                }</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Project Information Section -->
        <div>
          <h3 class="quotation-section-title" style="margin-bottom: 16px;">Project Details</h3>
          <div style="background-color: rgba(245, 245, 247, 0.5); border-radius: 12px; padding: 20px;">
            <div class="info-item">
              <span style="margin-right: 12px; color: var(--quotation-dark-light);">●</span>
              <div>
                <span class="info-label">Project Name</span>
                <p class="info-value" style="margin: 0;">${
                  formData.projectName
                }</p>
              </div>
            </div>
            <div class="info-item">
              <span style="margin-right: 12px; color: var(--quotation-dark-light);">●</span>
              <div>
                <span class="info-label">Overview</span>
                <p class="info-value" style="margin: 0;">  ${
                  formData.projectOverview.split(" ").slice(0, 20).join(" ") +
                  (formData.projectOverview.split(" ").length > 20 ? "..." : "")
                }</p>
              </div>
            </div>
            <div class="info-item">
              <span style="margin-right: 12px; color: var(--quotation-dark-light);">●</span>
              <div>
                <span class="info-label">Development</span>
                <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px;">
                  ${formData.developmentAreas
                    .map(
                      (area) => `
                    <span style="background-color: var(--quotation-yellow); color: var(--quotation-dark); padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">${area}</span>
                  `
                    )
                    .join("")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Service Details & Pricing - Improved Table -->
      <div style="padding: 32px; background-color: white;">
        <h3 class="quotation-section-title" style="margin-bottom: 16px;">Service & Pricing</h3>
        <div style="overflow: hidden; border-radius: 12px; border: 1px solid var(--quotation-gray-medium);">
          <table class="quotation-table">
            <thead>
              <tr>
                <th style="width: 50%;">Service Description</th>
                <th style="text-align: center; width: 15%;">Quantity</th>
                <th style="text-align: right; width: 15%;">Rate</th>
                <th style="text-align: right; width: 20%;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${
                formData.seniorDevelopers > 0
                  ? `
              <tr>
                <td>
                  <div style="display: flex; align-items: center;">
                    <div class="service-icon">
                      <span style="color: var(--quotation-dark);">●</span>
                    </div>
                    <div>
                      <p style="font-weight: 500; margin: 0;">Senior Developer</p>
                      <p style="font-size: 12px; color: var(--quotation-dark-light); margin: 4px 0 0 0;">Experienced developer for complex tasks</p>
                    </div>
                  </div>
                </td>
                <td style="text-align: center;">${
                  formData.seniorDevelopers
                }</td>
                <td style="text-align: right;">${formatCurrency(
                  seniorDevRate
                )}</td>
                <td style="text-align: right; font-weight: 500;">${formatCurrency(
                  seniorDevCost
                )}</td>
              </tr>
              `
                  : ""
              }
              
              ${
                formData.juniorDevelopers > 0
                  ? `
              <tr>
                <td>
                  <div style="display: flex; align-items: center;">
                    <div class="service-icon">
                      <span style="color: var(--quotation-dark);">●</span>
                    </div>
                    <div>
                      <p style="font-weight: 500; margin: 0;">Junior Developer</p>
                      <p style="font-size: 12px; color: var(--quotation-dark-light); margin: 4px 0 0 0;">Support implementation and coding</p>
                    </div>
                  </div>
                </td>
                <td style="text-align: center;">${
                  formData.juniorDevelopers
                }</td>
                <td style="text-align: right;">${formatCurrency(
                  juniorDevRate
                )}</td>
                <td style="text-align: right; font-weight: 500;">${formatCurrency(
                  juniorDevCost
                )}</td>
              </tr>
              `
                  : ""
              }
              
              ${
                formData.uiUxDesigners > 0
                  ? `
              <tr>
                <td>
                  <div style="display: flex; align-items: center;">
                    <div class="service-icon">
                      <span style="color: var(--quotation-dark);">●</span>
                    </div>
                    <div>
                      <p style="font-weight: 500; margin: 0;">UI/UX Designer</p>
                      <p style="font-size: 12px; color: var(--quotation-dark-light); margin: 4px 0 0 0;">Design interface and user experience</p>
                    </div>
                  </div>
                </td>
                <td style="text-align: center;">${formData.uiUxDesigners}</td>
                <td style="text-align: right;">${formatCurrency(uiUxRate)}</td>
                <td style="text-align: right; font-weight: 500;">${formatCurrency(
                  uiUxCost
                )}</td>
              </tr>
              `
                  : ""
              }
              
              <tr>
                <td>
                  <div style="display: flex; align-items: center;">
                    <div class="service-icon">
                      <span style="color: var(--quotation-dark);">●</span>
                    </div>
                    <div>
                      <p style="font-weight: 500; margin: 0;">Project Management</p>
                      <p style="font-size: 12px; color: var(--quotation-dark-light); margin: 4px 0 0 0;">Coordination and delivery oversight</p>
                    </div>
                  </div>
                </td>
                <td style="text-align: center;">1</td>
                <td style="text-align: right;">${formatCurrency(
                  projectManagementCost
                )}</td>
                <td style="text-align: right; font-weight: 500;">${formatCurrency(
                  projectManagementCost
                )}</td>
              </tr>
              
              <tr class="total-row">
                <td colspan="2">
                  <p style="font-weight: 700; font-size: 18px; margin: 0;">Grand Total</p>
                </td>
                <td colspan="2" style="text-align: right;">
                  <p style="font-weight: 700; font-size: 18px; margin: 0;">${formatCurrency(
                    totalCost
                  )}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Footer Section -->
      <div style="padding: 32px; background-color: var(--quotation-dark); color: rgba(255, 255, 255, 0.9); font-size: 14px;">
        <p style="margin: 0 0 4px 0;">This quotation is valid for 30 days from the issue date.</p>
        <p style="margin: 0;">All prices are subject to applicable taxes and may be adjusted based on project scope changes.</p>
      </div>
    </div>
  </body>
  </html>
    `;

  return quotationHtml;
};
