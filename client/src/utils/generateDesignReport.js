/**
 * Interior Design Report PDF Generator
 * Generates a comprehensive PDF report including:
 *  - Cover Page
 *  - Layout Plan (room dimensions, walls, furniture placement)
 *  - Materials Used
 *  - Cost Estimate
 *  - Lighting Plan
 */
import { jsPDF } from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
applyPlugin(jsPDF);

// --- Color Palette ---
const COLORS = {
    primary: [99, 102, 241],       // Indigo
    primaryDark: [55, 48, 163],    // Deep Indigo
    secondary: [139, 92, 246],     // Purple
    accent: [16, 185, 129],        // Emerald
    dark: [15, 23, 42],            // Slate 900
    darkAlt: [30, 41, 59],         // Slate 800
    text: [51, 65, 85],            // Slate 700
    textLight: [148, 163, 184],    // Slate 400
    white: [255, 255, 255],
    border: [226, 232, 240],       // Slate 200
    tableBg: [248, 250, 252],      // Slate 50
    success: [16, 185, 129],
    warning: [245, 158, 11],
    gold: [217, 168, 55],
};

// --- Furniture Database (materials, costs, categories) ---
const FURNITURE_DB = {
    sofa: { label: 'Modern Sofa', material: 'Premium Fabric + Solid Wood Frame', category: 'Living Room', unitCost: 35000, lighting: 'Ambient overhead' },
    armchair: { label: 'Armchair', material: 'Fabric Upholstery + Metal Legs', category: 'Living Room', unitCost: 12000, lighting: 'Side lamp recommended' },
    coffeeTable: { label: 'Coffee Table', material: 'Tempered Glass + Metal Frame', category: 'Living Room', unitCost: 8000, lighting: 'Ambient overhead' },
    tvUnit: { label: 'TV Unit', material: 'Engineered Wood + Laminate Finish', category: 'Living Room', unitCost: 18000, lighting: 'LED strip behind unit' },
    bedKing: { label: 'King Size Bed', material: 'Sheesham Wood + Memory Foam Mattress', category: 'Bedroom', unitCost: 45000, lighting: 'Warm bedside lamps' },
    bedSingle: { label: 'Single Bed', material: 'Engineered Wood + Spring Mattress', category: 'Bedroom', unitCost: 22000, lighting: 'Warm bedside lamps' },
    wardrobe: { label: 'Wardrobe', material: 'Plywood + PU Finish + Soft-Close Hinges', category: 'Bedroom', unitCost: 55000, lighting: 'Internal LED strip' },
    nightstand: { label: 'Nightstand', material: 'Solid Wood + Lacquer Finish', category: 'Bedroom', unitCost: 5000, lighting: 'Table lamp' },
    diningTable: { label: 'Dining Table', material: 'Teak Wood + Glass Top', category: 'Dining', unitCost: 25000, lighting: 'Pendant light above' },
    kitchenCabinet: { label: 'Kitchen Cabinet', material: 'Marine Plywood + Acrylic Finish', category: 'Kitchen', unitCost: 40000, lighting: 'Under-cabinet LED strip' },
    fridge: { label: 'Refrigerator', material: 'Stainless Steel + Frost Free', category: 'Kitchen', unitCost: 35000, lighting: 'Internal LED' },
    stove: { label: 'Stove / Hob', material: 'Tempered Glass + Brass Burners', category: 'Kitchen', unitCost: 15000, lighting: 'Chimney light' },
    desk: { label: 'Office Desk', material: 'Engineered Wood + Laminate', category: 'Office', unitCost: 12000, lighting: 'Desk lamp (5000K Cool White)' },
    bookshelf: { label: 'Bookshelf', material: 'Solid Wood + Metal Brackets', category: 'Office', unitCost: 10000, lighting: 'Spotlight / track light' },
    officeChair: { label: 'Office Chair', material: 'Mesh Back + Adjustable Lumbar', category: 'Office', unitCost: 8000, lighting: 'Ambient overhead' },
    plant: { label: 'Indoor Plant', material: 'Ceramic Pot + Live Plant', category: 'Decor', unitCost: 1500, lighting: 'Natural light preferred' },
    rug: { label: 'Area Rug', material: 'Hand-Tufted Wool Blend', category: 'Decor', unitCost: 8000, lighting: 'Ambient' },
    lampFloor: { label: 'Floor Lamp', material: 'Metal Stand + Fabric Shade', category: 'Decor', unitCost: 4500, lighting: 'Self-illuminating (Warm 2700K)' },
    window: { label: 'Window', material: 'UPVC Frame + Double Glazed Glass', category: 'Structure', unitCost: 12000, lighting: 'Natural daylight source' },
    door: { label: 'Door', material: 'Solid Core Wood + Brass Hardware', category: 'Structure', unitCost: 8000, lighting: 'N/A' },
    duck: { label: 'Rubber Duck (Decor)', material: 'PVC', category: 'Decor', unitCost: 200, lighting: 'Ambient' },
};

// --- Helper: Draw rounded rect ---
function roundedRect(doc, x, y, w, h, r, fill, stroke) {
    doc.roundedRect(x, y, w, h, r, r, fill ? 'F' : stroke ? 'S' : 'FD');
}

// --- Helper: Add page footer ---
function addFooter(doc, pageNum, totalPages) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.textLight);
    doc.text(`Interior Design Studio  •  Auto-Generated Report  •  Page ${pageNum} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(20, pageHeight - 12, pageWidth - 20, pageHeight - 12);
}

// --- Helper: Section Header ---
function sectionHeader(doc, y, icon, title) {
    const pageWidth = doc.internal.pageSize.getWidth();
    // Background bar
    doc.setFillColor(...COLORS.primary);
    doc.roundedRect(20, y, pageWidth - 40, 12, 2, 2, 'F');
    // Text
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.white);
    doc.text(`${icon}  ${title}`, 28, y + 8);
    return y + 18;
}

// --- Helper: Light gray info box ---
function infoBox(doc, x, y, w, h, label, value) {
    doc.setFillColor(...COLORS.tableBg);
    doc.roundedRect(x, y, w, h, 2, 2, 'F');
    doc.setDrawColor(...COLORS.border);
    doc.roundedRect(x, y, w, h, 2, 2, 'S');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textLight);
    doc.text(label, x + w / 2, y + 6, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.dark);
    doc.text(String(value), x + w / 2, y + 14, { align: 'center' });
}

/**
 * Main Report Generation Function
 */
export function generateDesignReport({ furniture, walls, budgetData, roomDimensions }) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // ==========================================================
    // PAGE 1: COVER PAGE
    // ==========================================================
    // Dark background
    doc.setFillColor(...COLORS.dark);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Decorative gradient bar at top
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pageWidth, 6, 'F');
    doc.setFillColor(...COLORS.secondary);
    doc.rect(0, 6, pageWidth, 2, 'F');

    // Company title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text('INTERIOR DESIGN STUDIO', pageWidth / 2, 30, { align: 'center' });

    // Main title
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.white);
    doc.text('Interior Design', pageWidth / 2, 80, { align: 'center' });
    doc.text('Report', pageWidth / 2, 96, { align: 'center' });

    // Decorative line
    doc.setDrawColor(...COLORS.primary);
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 30, 105, pageWidth / 2 + 30, 105);

    // Subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textLight);
    doc.text('Auto-Generated Comprehensive Analysis', pageWidth / 2, 115, { align: 'center' });

    // Info cards on cover
    const cardY = 140;
    const cardW = 45;
    const cardGap = 8;
    const totalCardW = cardW * 3 + cardGap * 2;
    const startX = (pageWidth - totalCardW) / 2;

    const area = budgetData?.area || 'N/A';
    const style = budgetData?.style ? budgetData.style.charAt(0).toUpperCase() + budgetData.style.slice(1) : 'Custom';
    const furnitureCount = furniture?.length || 0;

    // Card 1: Area
    doc.setFillColor(...COLORS.darkAlt);
    doc.roundedRect(startX, cardY, cardW, 30, 3, 3, 'F');
    doc.setDrawColor(...COLORS.primary);
    doc.roundedRect(startX, cardY, cardW, 30, 3, 3, 'S');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.textLight);
    doc.text('CARPET AREA', startX + cardW / 2, cardY + 10, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.accent);
    doc.text(`${area} sq.ft`, startX + cardW / 2, cardY + 22, { align: 'center' });

    // Card 2: Style
    doc.setFillColor(...COLORS.darkAlt);
    doc.roundedRect(startX + cardW + cardGap, cardY, cardW, 30, 3, 3, 'F');
    doc.setDrawColor(...COLORS.primary);
    doc.roundedRect(startX + cardW + cardGap, cardY, cardW, 30, 3, 3, 'S');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textLight);
    doc.text('DESIGN STYLE', startX + cardW + cardGap + cardW / 2, cardY + 10, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.gold);
    doc.text(style, startX + cardW + cardGap + cardW / 2, cardY + 22, { align: 'center' });

    // Card 3: Items
    doc.setFillColor(...COLORS.darkAlt);
    doc.roundedRect(startX + (cardW + cardGap) * 2, cardY, cardW, 30, 3, 3, 'F');
    doc.setDrawColor(...COLORS.primary);
    doc.roundedRect(startX + (cardW + cardGap) * 2, cardY, cardW, 30, 3, 3, 'S');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textLight);
    doc.text('TOTAL ITEMS', startX + (cardW + cardGap) * 2 + cardW / 2, cardY + 10, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text(String(furnitureCount), startX + (cardW + cardGap) * 2 + cardW / 2, cardY + 22, { align: 'center' });

    // Table of Contents
    const tocY = 195;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.white);
    doc.text('REPORT CONTENTS', pageWidth / 2, tocY, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textLight);
    const tocItems = [
        '1.  Layout Plan & Room Overview',
        '2.  Materials Used & Specifications',
        '3.  Cost Estimate & Budget Breakdown',
        '4.  Lighting Plan & Recommendations',
    ];
    tocItems.forEach((item, i) => {
        doc.text(item, pageWidth / 2, tocY + 10 + i * 8, { align: 'center' });
    });

    // Date + Generated By
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.textLight);
    const dateStr = new Date().toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    doc.text(`Generated on: ${dateStr}`, pageWidth / 2, pageHeight - 30, { align: 'center' });
    doc.setFontSize(8);
    doc.text('Powered by Interior Design Studio Pro', pageWidth / 2, pageHeight - 22, { align: 'center' });

    // Bottom gradient
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, pageHeight - 8, pageWidth, 4, 'F');
    doc.setFillColor(...COLORS.secondary);
    doc.rect(0, pageHeight - 4, pageWidth, 4, 'F');

    // ==========================================================
    // PAGE 2: LAYOUT PLAN
    // ==========================================================
    doc.addPage();
    let y = 20;

    y = sectionHeader(doc, y, '📐', 'LAYOUT PLAN & ROOM OVERVIEW');
    y += 4;

    // Room Dimensions Info
    const dimW = contentWidth / 3 - 4;
    const dims = roomDimensions || [8, 3, 6];
    infoBox(doc, margin, y, dimW, 20, 'WIDTH', `${dims[0].toFixed(1)} m`);
    infoBox(doc, margin + dimW + 6, y, dimW, 20, 'HEIGHT', `${dims[1].toFixed(1)} m`);
    infoBox(doc, margin + (dimW + 6) * 2, y, dimW, 20, 'DEPTH', `${dims[2].toFixed(1)} m`);
    y += 28;

    // Additional Info
    infoBox(doc, margin, y, dimW, 20, 'TOTAL WALLS', String(walls?.length || 0));
    infoBox(doc, margin + dimW + 6, y, dimW, 20, 'TOTAL FURNITURE', String(furniture?.length || 0));
    infoBox(doc, margin + (dimW + 6) * 2, y, dimW, 20, 'FLOOR AREA', `${(dims[0] * dims[2]).toFixed(1)} m²`);
    y += 28;

    // Floor Plan Diagram (simplified top-down view)
    y = sectionHeader(doc, y, '🗺️', 'TOP-DOWN FLOOR PLAN (APPROXIMATE)');
    y += 4;

    const planW = contentWidth;
    const planH = 90;
    const planX = margin;
    const planY = y;

    // Background
    doc.setFillColor(245, 245, 250);
    doc.roundedRect(planX, planY, planW, planH, 3, 3, 'F');
    doc.setDrawColor(...COLORS.border);
    doc.roundedRect(planX, planY, planW, planH, 3, 3, 'S');

    // Draw walls on the plan
    if (walls && walls.length > 0) {
        const allX = walls.flatMap(w => [w.start[0], w.end[0]]);
        const allZ = walls.flatMap(w => [w.start[2], w.end[2]]);
        const minX = Math.min(...allX);
        const maxX = Math.max(...allX);
        const minZ = Math.min(...allZ);
        const maxZ = Math.max(...allZ);
        const rangeX = maxX - minX || 1;
        const rangeZ = maxZ - minZ || 1;

        const mapX = (val) => planX + 8 + ((val - minX) / rangeX) * (planW - 16);
        const mapZ = (val) => planY + 8 + ((val - minZ) / rangeZ) * (planH - 16);

        // Draw walls
        doc.setDrawColor(60, 60, 80);
        doc.setLineWidth(1.2);
        walls.forEach(wall => {
            const x1 = mapX(wall.start[0]);
            const z1 = mapZ(wall.start[2]);
            const x2 = mapX(wall.end[0]);
            const z2 = mapZ(wall.end[2]);
            doc.line(x1, z1, x2, z2);
        });

        // Draw furniture positions
        if (furniture && furniture.length > 0) {
            furniture.forEach(item => {
                const fx = mapX(item.position[0]);
                const fz = mapZ(item.position[2]);
                const info = FURNITURE_DB[item.type];

                // Color by category
                let col = COLORS.primary;
                if (info) {
                    if (info.category === 'Living Room') col = [59, 130, 246];
                    else if (info.category === 'Bedroom') col = [168, 85, 247];
                    else if (info.category === 'Kitchen') col = [245, 158, 11];
                    else if (info.category === 'Dining') col = [16, 185, 129];
                    else if (info.category === 'Office') col = [99, 102, 241];
                    else if (info.category === 'Decor') col = [236, 72, 153];
                    else if (info.category === 'Structure') col = [107, 114, 128];
                }

                doc.setFillColor(...col);
                doc.circle(fx, fz, 2.5, 'F');
                doc.setFontSize(5);
                doc.setTextColor(...col);
                const shortName = info?.label?.split(' ').pop() || item.type;
                doc.text(shortName, fx, fz + 5, { align: 'center' });
            });
        }
    }

    // Legend
    y = planY + planH + 6;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text('LEGEND:', margin, y);
    const legendItems = [
        { color: [59, 130, 246], label: 'Living' },
        { color: [168, 85, 247], label: 'Bedroom' },
        { color: [245, 158, 11], label: 'Kitchen' },
        { color: [16, 185, 129], label: 'Dining' },
        { color: [99, 102, 241], label: 'Office' },
        { color: [236, 72, 153], label: 'Decor' },
        { color: [107, 114, 128], label: 'Structure' },
    ];
    let legendX = margin + 20;
    legendItems.forEach(item => {
        doc.setFillColor(...item.color);
        doc.circle(legendX, y - 1.5, 1.5, 'F');
        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...COLORS.text);
        doc.text(item.label, legendX + 3, y);
        legendX += 22;
    });

    y += 8;

    // Walls Table
    if (walls && walls.length > 0) {
        y = sectionHeader(doc, y, '🧱', 'WALL SPECIFICATIONS');
        y += 2;

        const wallData = walls.map((w, i) => [
            `W-${i + 1}`,
            `(${w.start[0].toFixed(1)}, ${w.start[2].toFixed(1)})`,
            `(${w.end[0].toFixed(1)}, ${w.end[2].toFixed(1)})`,
            `${w.height || 3} m`,
            `${w.thickness || 0.2} m`,
            w.color || '#fff',
        ]);

        doc.autoTable({
            startY: y,
            head: [['Wall ID', 'Start (X, Z)', 'End (X, Z)', 'Height', 'Thickness', 'Color']],
            body: wallData,
            margin: { left: margin, right: margin },
            styles: {
                fontSize: 7,
                cellPadding: 2,
                textColor: COLORS.text,
            },
            headStyles: {
                fillColor: COLORS.primary,
                textColor: COLORS.white,
                fontStyle: 'bold',
                fontSize: 7,
            },
            alternateRowStyles: {
                fillColor: COLORS.tableBg,
            },
            theme: 'grid',
        });
        y = doc.lastAutoTable.finalY + 6;
    }

    // ==========================================================
    // PAGE 3: MATERIALS USED
    // ==========================================================
    doc.addPage();
    y = 20;

    y = sectionHeader(doc, y, '🧱', 'MATERIALS USED & SPECIFICATIONS');
    y += 4;

    // Group furniture by category
    const categories = {};
    (furniture || []).forEach(item => {
        const info = FURNITURE_DB[item.type] || { label: item.type, material: 'Standard material', category: 'Other', unitCost: 5000 };
        if (!categories[info.category]) categories[info.category] = [];
        categories[info.category].push({ ...info, itemData: item });
    });

    // Materials table
    const materialRows = [];
    Object.entries(categories).forEach(([cat, items]) => {
        const counts = {};
        items.forEach(item => {
            const key = item.label;
            if (!counts[key]) counts[key] = { ...item, qty: 0 };
            counts[key].qty++;
        });
        Object.values(counts).forEach(item => {
            materialRows.push([
                cat,
                item.label,
                String(item.qty),
                item.material,
            ]);
        });
    });

    if (materialRows.length > 0) {
        doc.autoTable({
            startY: y,
            head: [['Category', 'Item', 'Qty', 'Material Specification']],
            body: materialRows,
            margin: { left: margin, right: margin },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 30 },
                2: { cellWidth: 12 },
                3: { cellWidth: 'auto' },
            },
            styles: {
                fontSize: 8,
                cellPadding: 3,
                textColor: COLORS.text,
                lineColor: COLORS.border,
            },
            headStyles: {
                fillColor: COLORS.primary,
                textColor: COLORS.white,
                fontStyle: 'bold',
                fontSize: 8,
            },
            alternateRowStyles: {
                fillColor: COLORS.tableBg,
            },
            theme: 'grid',
        });
        y = doc.lastAutoTable.finalY + 8;
    } else {
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.textLight);
        doc.text('No furniture items placed yet.', pageWidth / 2, y + 10, { align: 'center' });
        y += 20;
    }

    // Material Summary Notes
    y = sectionHeader(doc, y, '📋', 'MATERIAL NOTES & RECOMMENDATIONS');
    y += 4;

    const notes = [
        'All wood furniture uses ISI-marked plywood with termite-resistant treatment.',
        'Fabric upholstery comes with Scotchgard stain protection coating.',
        'Metal components are powder-coated for rust resistance.',
        'Glass surfaces use 12mm tempered safety glass (IS 2553 certified).',
        'Paint finish: Asian Paints Royale Luxury Emulsion (2 coats + 1 primer).',
        'Flooring: Vitrified tiles 800x800mm (if selected) or existing flooring retained.',
    ];

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);
    notes.forEach((note, i) => {
        doc.setFillColor(i % 2 === 0 ? 248 : 241, i % 2 === 0 ? 250 : 245, i % 2 === 0 ? 252 : 249);
        doc.roundedRect(margin, y, contentWidth, 8, 1, 1, 'F');
        doc.text(`•  ${note}`, margin + 4, y + 5.5);
        y += 10;
    });

    // ==========================================================
    // PAGE 4: COST ESTIMATE
    // ==========================================================
    doc.addPage();
    y = 20;

    y = sectionHeader(doc, y, '💰', 'COST ESTIMATE & BUDGET BREAKDOWN');
    y += 4;

    // Calculate costs
    const styleRate = budgetData?.style === 'luxury' ? 3500 : budgetData?.style === 'premium' ? 2200 : 1200;
    const areaSqFt = parseFloat(budgetData?.area) || 0;

    // Cost categories
    const costBreakdown = {};
    (furniture || []).forEach(item => {
        const info = FURNITURE_DB[item.type] || { label: item.type, unitCost: 5000, category: 'Other' };
        if (!costBreakdown[info.category]) costBreakdown[info.category] = { items: [], total: 0 };
        costBreakdown[info.category].items.push(info);
        costBreakdown[info.category].total += info.unitCost;
    });

    // Budget summary cards
    const furnitureTotalCost = Object.values(costBreakdown).reduce((sum, cat) => sum + cat.total, 0);
    const civilCost = areaSqFt * (styleRate * 0.4);
    const paintingCost = areaSqFt * (budgetData?.items?.painting ? 25 : 0);
    const ceilingCost = areaSqFt * (budgetData?.items?.falseCeiling ? styleRate * 0.15 : 0);
    const flooringCost = areaSqFt * (budgetData?.items?.flooring ? styleRate * 0.2 : 0);
    const labourCost = (furnitureTotalCost + civilCost) * 0.15;
    const grandTotal = furnitureTotalCost + civilCost + paintingCost + ceilingCost + flooringCost + labourCost;

    // Summary Cards Row
    const sumCardW = contentWidth / 3 - 4;
    infoBox(doc, margin, y, sumCardW, 22, 'FURNITURE COST', `₹${furnitureTotalCost.toLocaleString()}`);
    infoBox(doc, margin + sumCardW + 6, y, sumCardW, 22, 'CIVIL / MATERIAL', `₹${Math.round(civilCost).toLocaleString()}`);
    infoBox(doc, margin + (sumCardW + 6) * 2, y, sumCardW, 22, 'LABOUR CHARGES', `₹${Math.round(labourCost).toLocaleString()}`);
    y += 30;

    // Detailed Cost Table
    const costRows = [];
    Object.entries(costBreakdown).forEach(([category, data]) => {
        const counts = {};
        data.items.forEach(info => {
            if (!counts[info.label]) counts[info.label] = { ...info, qty: 0, total: 0 };
            counts[info.label].qty++;
            counts[info.label].total += info.unitCost;
        });
        Object.values(counts).forEach(item => {
            costRows.push([
                category,
                item.label,
                String(item.qty),
                `₹${item.unitCost.toLocaleString()}`,
                `₹${item.total.toLocaleString()}`,
            ]);
        });
    });

    // Add service costs
    if (civilCost > 0) costRows.push(['Civil Work', 'Material & Construction', '1', '-', `₹${Math.round(civilCost).toLocaleString()}`]);
    if (paintingCost > 0) costRows.push(['Services', 'Wall Painting', '1', '-', `₹${Math.round(paintingCost).toLocaleString()}`]);
    if (ceilingCost > 0) costRows.push(['Services', 'False Ceiling', '1', '-', `₹${Math.round(ceilingCost).toLocaleString()}`]);
    if (flooringCost > 0) costRows.push(['Services', 'Flooring', '1', '-', `₹${Math.round(flooringCost).toLocaleString()}`]);
    costRows.push(['Labour', 'Installation & Labour', '-', '-', `₹${Math.round(labourCost).toLocaleString()}`]);

    if (costRows.length > 0) {
        doc.autoTable({
            startY: y,
            head: [['Category', 'Item', 'Qty', 'Unit Cost', 'Total']],
            body: costRows,
            margin: { left: margin, right: margin },
            styles: {
                fontSize: 8,
                cellPadding: 3,
                textColor: COLORS.text,
            },
            headStyles: {
                fillColor: COLORS.primary,
                textColor: COLORS.white,
                fontStyle: 'bold',
                fontSize: 8,
            },
            alternateRowStyles: {
                fillColor: COLORS.tableBg,
            },
            theme: 'grid',
            didDrawPage: () => { },
        });
        y = doc.lastAutoTable.finalY + 6;
    }

    // Grand Total Box
    doc.setFillColor(...COLORS.dark);
    doc.roundedRect(margin, y, contentWidth, 20, 3, 3, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.white);
    doc.text('ESTIMATED GRAND TOTAL', margin + 10, y + 9);
    doc.setFontSize(18);
    doc.setTextColor(...COLORS.accent);
    doc.text(`₹ ${Math.round(grandTotal).toLocaleString()}`, pageWidth - margin - 10, y + 13, { align: 'right' });
    y += 26;

    // Budget range
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.textLight);
    doc.text(`Budget Range: ₹${Math.round(grandTotal * 0.9).toLocaleString()} - ₹${Math.round(grandTotal * 1.1).toLocaleString()} (±10% market variation)`, pageWidth / 2, y + 2, { align: 'center' });
    y += 10;

    // Payment Schedule
    y = sectionHeader(doc, y, '📅', 'SUGGESTED PAYMENT SCHEDULE');
    y += 2;

    const paymentData = [
        ['Phase 1', 'Booking & Design Approval', '20%', `₹${Math.round(grandTotal * 0.2).toLocaleString()}`],
        ['Phase 2', 'Material Procurement', '30%', `₹${Math.round(grandTotal * 0.3).toLocaleString()}`],
        ['Phase 3', 'Mid-Project (50% work done)', '30%', `₹${Math.round(grandTotal * 0.3).toLocaleString()}`],
        ['Phase 4', 'Final Handover', '20%', `₹${Math.round(grandTotal * 0.2).toLocaleString()}`],
    ];

    doc.autoTable({
        startY: y,
        head: [['Phase', 'Milestone', 'Percentage', 'Amount']],
        body: paymentData,
        margin: { left: margin, right: margin },
        styles: { fontSize: 8, cellPadding: 3, textColor: COLORS.text },
        headStyles: { fillColor: COLORS.accent, textColor: COLORS.white, fontStyle: 'bold', fontSize: 8 },
        alternateRowStyles: { fillColor: COLORS.tableBg },
        theme: 'grid',
    });

    // ==========================================================
    // PAGE 5: LIGHTING PLAN
    // ==========================================================
    doc.addPage();
    y = 20;

    y = sectionHeader(doc, y, '💡', 'LIGHTING PLAN & RECOMMENDATIONS');
    y += 4;

    // General lighting overview
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);
    doc.text('A well-designed lighting plan enhances the aesthetics and functionality of every room.', margin, y + 4);
    doc.text('Below is the recommended lighting for each placed item and room zone.', margin, y + 10);
    y += 18;

    // Lighting per item table
    const lightingRows = [];
    const lightCounts = {};
    (furniture || []).forEach(item => {
        const info = FURNITURE_DB[item.type] || { label: item.type, lighting: 'Ambient overhead', category: 'Other' };
        const key = `${info.label}_${info.category}`;
        if (!lightCounts[key]) lightCounts[key] = { ...info, qty: 0 };
        lightCounts[key].qty++;
    });

    Object.values(lightCounts).forEach(item => {
        lightingRows.push([
            item.category,
            item.label,
            String(item.qty),
            item.lighting,
        ]);
    });

    if (lightingRows.length > 0) {
        doc.autoTable({
            startY: y,
            head: [['Zone', 'Item', 'Qty', 'Recommended Lighting']],
            body: lightingRows,
            margin: { left: margin, right: margin },
            styles: { fontSize: 8, cellPadding: 3, textColor: COLORS.text },
            headStyles: { fillColor: [245, 158, 11], textColor: COLORS.white, fontStyle: 'bold', fontSize: 8 },
            alternateRowStyles: { fillColor: [255, 251, 235] },
            theme: 'grid',
        });
        y = doc.lastAutoTable.finalY + 8;
    }

    // Room-wise Lighting Recommendations
    y = sectionHeader(doc, y, '🏠', 'ROOM-WISE LIGHTING GUIDE');
    y += 4;

    const roomLighting = [
        {
            room: 'Living Room / Hall',
            fixtures: [
                'Ceiling: Recessed LED downlights (4000K Neutral White) - 10W x 6 nos',
                'Accent: LED strip along false ceiling cove (Warm White 3000K)',
                'Task: Floor lamp near reading/sofa area (2700K Warm)',
                'Decorative: Wall-mounted sconces on feature wall',
            ]
        },
        {
            room: 'Bedroom',
            fixtures: [
                'Ceiling: Dimmable LED panel light (3000K Warm White) - 18W x 2',
                'Bedside: Wall-mounted reading lights with swing arm',
                'Wardrobe: Internal LED strip (Auto-on with door sensor)',
                'Mood: RGB LED strip behind headboard (optional)',
            ]
        },
        {
            room: 'Kitchen',
            fixtures: [
                'Ceiling: Flush-mount LED panel (5000K Daylight) - 20W x 2',
                'Task: Under-cabinet LED strip lighting (4000K)',
                'Chimney: Built-in halogen/LED light',
                'Dining: Pendant light / chandelier above dining table',
            ]
        },
        {
            room: 'Bathroom',
            fixtures: [
                'Ceiling: IP65 rated LED downlight (4000K) - 12W x 2',
                'Mirror: LED backlit mirror panel (5000K)',
                'Mood: LED strip in shower niche (Warm White, IP67)',
            ]
        },
        {
            room: 'Pooja Room / Prayer Area',
            fixtures: [
                'Warm spotlight (2700K) focused on deity area',
                'LED diya / candle effect light strip',
                'Ambient: Small warm pendant light',
            ]
        },
    ];

    roomLighting.forEach(room => {
        // Room header
        doc.setFillColor(...COLORS.darkAlt);
        doc.roundedRect(margin, y, contentWidth, 8, 2, 2, 'F');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...COLORS.white);
        doc.text(`  ${room.room}`, margin + 2, y + 5.5);
        y += 10;

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...COLORS.text);
        room.fixtures.forEach(fixture => {
            if (y > pageHeight - 20) {
                doc.addPage();
                y = 20;
            }
            doc.text(`    •  ${fixture}`, margin + 4, y + 3);
            y += 6;
        });
        y += 4;
    });

    // Electrical Load Summary
    if (y > pageHeight - 60) {
        doc.addPage();
        y = 20;
    }
    y = sectionHeader(doc, y, '⚡', 'ESTIMATED ELECTRICAL LOAD');
    y += 2;

    const electricalData = [
        ['LED Downlights', '10-20W each', '~12-15 nos', '~200W'],
        ['LED Strip Lights', '5-14W/m', '~15m total', '~150W'],
        ['Pendant / Chandeliers', '40-60W each', '2-3 nos', '~150W'],
        ['Floor / Table Lamps', '40W each', '2-3 nos', '~120W'],
        ['Kitchen Appliances', 'Variable', '-', '~2000W'],
        ['HVAC / AC', '1500W each', '2-3 nos', '~4000W'],
        ['Miscellaneous', '-', '-', '~500W'],
    ];

    doc.autoTable({
        startY: y,
        head: [['Fixture Type', 'Wattage', 'Estimated Qty', 'Total Load']],
        body: electricalData,
        margin: { left: margin, right: margin },
        styles: { fontSize: 7.5, cellPadding: 2.5, textColor: COLORS.text },
        headStyles: { fillColor: COLORS.warning, textColor: COLORS.white, fontStyle: 'bold', fontSize: 8 },
        alternateRowStyles: { fillColor: [255, 251, 235] },
        theme: 'grid',
        foot: [['', '', 'TOTAL ESTIMATED', '~7,120W']],
        footStyles: { fillColor: COLORS.dark, textColor: COLORS.white, fontStyle: 'bold' },
    });

    // ==========================================================
    // ADD PAGE NUMBERS TO ALL PAGES
    // ==========================================================
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 2; i <= totalPages; i++) {
        doc.setPage(i);
        addFooter(doc, i, totalPages);
    }

    // ==========================================================
    // SAVE PDF
    // ==========================================================
    const fileName = `Interior_Design_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);

    return fileName;
}

export default generateDesignReport;
