import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const workspaceDir = "/Users/heyi/Downloads/ai-coding-notes/1.basic";
const buildDir = path.join(workspaceDir, ".pptx-build", "package");
const outputDir = path.join(workspaceDir, "output");
const outputPath = path.join(outputDir, "html-introduction.pptx");
const EMU_PER_INCH = 914400;
const slideWidth = 13.333333;
const slideHeight = 7.5;

const xml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const emu = (inches) => Math.round(inches * EMU_PER_INCH);
const escAttr = (value) => xml(value);

function colorFill(color) {
    return `<a:solidFill><a:srgbClr val="${color}"/></a:solidFill>`;
}

function line(color = "000000", width = 0) {
    return width > 0
        ? `<a:ln w="${width}"><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:prstDash val="solid"/></a:ln>`
        : `<a:ln w="0"><a:noFill/></a:ln>`;
}

function paragraph(text, {
    font = "Arial Unicode MS",
    size = 18,
    color = "F7FAFC",
    bold = false,
    italic = false,
    align = "l",
    level = 0,
    breakLine = false,
} = {}) {
    const pPr = `<a:pPr${level ? ` lvl="${level}"` : ""} algn="${align}"/>`;
    const rPr = `<a:rPr lang="zh-CN" sz="${size * 100}"${bold ? ' b="1"' : ""}${italic ? ' i="1"' : ""}><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="${escAttr(font)}"/><a:ea typeface="${escAttr(font)}"/></a:rPr>`;
    const end = breakLine ? "<a:br/>" : "";
    return `<a:p>${pPr}${rPr}<a:t>${xml(text)}</a:t>${end}<a:endParaRPr lang="zh-CN" sz="${size * 100}"><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="${escAttr(font)}"/><a:ea typeface="${escAttr(font)}"/></a:endParaRPr></a:p>`;
}

function multiParagraph(lines, style = {}) {
    return lines.map((entry, index) => {
        const value = typeof entry === "string" ? { text: entry } : entry;
        return paragraph(value.text, { ...style, ...value, breakLine: index < lines.length - 1 });
    }).join("");
}

function textBox(id, name, x, y, w, h, lines, {
    font = "Arial Unicode MS",
    size = 18,
    color = "F7FAFC",
    bold = false,
    italic = false,
    align = "l",
    margin = 0.04,
    fill = null,
    border = null,
    radius = false,
    valign = "t",
    code = false,
} = {}) {
    const textLines = Array.isArray(lines) ? lines : [lines];
    const bodyStyle = code ? { font: "Menlo", size, color, bold, italic, align } : { font, size, color, bold, italic, align };
    const shape = radius ? "<a:prstGeom prst=\"roundRect\"><a:avLst/></a:prstGeom>" : "<a:prstGeom prst=\"rect\"><a:avLst/></a:prstGeom>";
    const body = `<p:txBody><a:bodyPr wrap="square" anchor="${valign}" lIns="${emu(margin)}" rIns="${emu(margin)}" tIns="${emu(margin)}" bIns="${emu(margin)}"><a:noAutofit/></a:bodyPr><a:lstStyle/>${multiParagraph(textLines, bodyStyle)}</p:txBody>`;
    return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${escAttr(name)}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(w)}" cy="${emu(h)}"/></a:xfrm>${shape}${fill ? colorFill(fill) : "<a:noFill/>"}${border ? line(border.color, border.width) : line()}</p:spPr>${body}</p:sp>`;
}

function rect(id, name, x, y, w, h, fill, border = null, radius = false) {
    const shape = radius ? "<a:prstGeom prst=\"roundRect\"><a:avLst/></a:prstGeom>" : "<a:prstGeom prst=\"rect\"><a:avLst/></a:prstGeom>";
    return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${escAttr(name)}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(w)}" cy="${emu(h)}"/></a:xfrm>${shape}${colorFill(fill)}${border ? line(border.color, border.width) : line()}</p:spPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p/></p:txBody></p:sp>`;
}

function lineShape(id, name, x, y, w, h, color, width = 2) {
    return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${escAttr(name)}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(w)}" cy="${emu(h)}"/></a:xfrm><a:prstGeom prst="line"><a:avLst/></a:prstGeom>${line(color, width)}</p:spPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p/></p:txBody></p:sp>`;
}

function slideXml(slideNumber, shapes) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld name="Slide ${slideNumber}"><p:spTree>
    <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
    <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
    ${shapes.join("\n    ")}
  </p:spTree></p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>`;
}

function slide1() {
    const bg = "0B1220";
    return slideXml(1, [
        rect(2, "Background", 0, 0, slideWidth, slideHeight, bg),
        textBox(3, "Eyebrow", 0.72, 0.56, 4, 0.26, "WEB BASICS  /  01", { font: "Menlo", size: 10, color: "47D7FF", bold: true }),
        textBox(4, "Title", 0.72, 1.02, 4.7, 0.9, "HTML", { font: "Helvetica Neue", size: 48, color: "F7FAFC", bold: true }),
        textBox(5, "Subtitle", 0.76, 2.05, 4.5, 0.7, "网页的结构层", { size: 25, color: "C7F36B", bold: true }),
        textBox(6, "Body", 0.76, 2.86, 4.55, 1.05, "用标签描述内容，用结构组织信息。\n浏览器从 HTML 读懂页面骨架。", { size: 16, color: "A5B1C2" }),
        rect(7, "Code panel", 6.0, 0.92, 6.56, 5.55, "121D2C", { color: "2B3A4D", width: 1 }, true),
        textBox(8, "Code label", 6.42, 1.28, 2.2, 0.28, "A SIMPLE DOCUMENT", { font: "Menlo", size: 10, color: "FF8C6B", bold: true }),
        textBox(9, "Code", 6.42, 1.82, 5.52, 3.35, [
            "<!doctype html>",
            "<html lang=\"zh-CN\">",
            "  <head>",
            "    <title>我的页面</title>",
            "  </head>",
            "  <body>",
            "    <h1>你好，HTML</h1>",
            "  </body>",
            "</html>",
        ], { font: "Menlo", size: 14, color: "F7FAFC", code: true }),
        lineShape(10, "Accent line", 0.76, 5.63, 1.0, 0, "47D7FF", 4),
        textBox(11, "Footer", 1.93, 5.47, 3.5, 0.35, "HyperText Markup Language", { font: "Menlo", size: 11, color: "A5B1C2" }),
        textBox(12, "Page", 12.05, 6.75, 0.5, 0.25, "01", { font: "Menlo", size: 10, color: "A5B1C2", align: "r" }),
    ]);
}

function slide2() {
    const bg = "0B1220";
    return slideXml(2, [
        rect(2, "Background", 0, 0, slideWidth, slideHeight, bg),
        textBox(3, "Eyebrow", 0.72, 0.52, 4, 0.26, "WEB BASICS  /  02", { font: "Menlo", size: 10, color: "47D7FF", bold: true }),
        textBox(4, "Title", 0.72, 0.96, 8.5, 0.62, "页面结构，从语义开始", { size: 29, color: "F7FAFC", bold: true }),
        textBox(5, "Lead", 0.76, 1.7, 8.7, 0.55, "标签的选择，决定浏览器如何理解内容。", { size: 16, color: "A5B1C2" }),
        rect(6, "Code panel", 0.72, 2.55, 5.42, 3.18, "121D2C", { color: "2B3A4D", width: 1 }, true),
        textBox(7, "Code label", 1.12, 2.9, 2.2, 0.28, "SEMANTIC HTML", { font: "Menlo", size: 10, color: "FF8C6B", bold: true }),
        textBox(8, "Semantic code", 1.12, 3.4, 4.5, 1.9, [
            "<header>品牌与导航</header>",
            "<main>核心内容</main>",
            "<footer>版权与联系</footer>",
        ], { font: "Menlo", size: 14, color: "F7FAFC", code: true }),
        lineShape(9, "Column divider", 6.58, 2.6, 0, 3.0, "2B3A4D", 1),
        textBox(10, "Point 1", 7.05, 2.58, 4.7, 0.34, "内容", { size: 17, color: "C7F36B", bold: true }),
        textBox(11, "Point 1 body", 7.05, 2.96, 5.25, 0.46, "标题、段落、链接等真实信息。", { size: 15, color: "F7FAFC" }),
        textBox(12, "Point 2", 7.05, 3.65, 4.7, 0.34, "结构", { size: 17, color: "C7F36B", bold: true }),
        textBox(13, "Point 2 body", 7.05, 4.03, 5.25, 0.46, "header、main、footer 让页面有层次。", { size: 15, color: "F7FAFC" }),
        textBox(14, "Point 3", 7.05, 4.72, 4.7, 0.34, "意义", { size: 17, color: "C7F36B", bold: true }),
        textBox(15, "Point 3 body", 7.05, 5.1, 5.25, 0.56, "浏览器、搜索引擎和辅助技术都能更准确地理解页面。", { size: 15, color: "F7FAFC" }),
        rect(16, "Takeaway", 0.72, 6.05, 11.85, 0.66, "172538", { color: "47D7FF", width: 1 }, true),
        textBox(17, "Takeaway text", 1.04, 6.18, 11.2, 0.3, "HTML 负责结构   ·   CSS 负责呈现   ·   JavaScript 负责行为", { font: "Menlo", size: 13, color: "47D7FF", bold: true, align: "c" }),
        textBox(18, "Page", 12.05, 6.75, 0.5, 0.25, "02", { font: "Menlo", size: 10, color: "A5B1C2", align: "r" }),
    ]);
}

const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
  <Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide2.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;

const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

const presentationXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" saveSubsetFonts="1">
  <p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>
  <p:sldIdLst><p:sldId id="256" r:id="rId2"/><p:sldId id="257" r:id="rId3"/></p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000" type="screen16x9"/>
  <p:notesSz cx="6858000" cy="9144000"/>
  <p:defaultTextStyle><a:defPPr/><a:lvl1pPr marL="0" indent="0"><a:defRPr lang="zh-CN"/></a:lvl1pPr></p:defaultTextStyle>
</p:presentation>`;

const presentationRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide2.xml"/>
</Relationships>`;

const masterXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld name="Master"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  <p:sldLayoutIdLst><p:sldLayoutId id="1" r:id="rId1"/></p:sldLayoutIdLst>
  <p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles>
</p:sldMaster>`;

const masterRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>
</Relationships>`;

const layoutXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1"><p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`;

const layoutRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>`;

const themeXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="HTML Basics"><a:themeElements><a:clrScheme name="HTML Basics"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="0B1220"/></a:dk2><a:lt2><a:srgbClr val="F7FAFC"/></a:lt2><a:accent1><a:srgbClr val="47D7FF"/></a:accent1><a:accent2><a:srgbClr val="FF8C6B"/></a:accent2><a:accent3><a:srgbClr val="C7F36B"/></a:accent3><a:accent4><a:srgbClr val="A5B1C2"/></a:accent4><a:accent5><a:srgbClr val="121D2C"/></a:accent5><a:accent6><a:srgbClr val="2B3A4D"/></a:accent6><a:hlink><a:srgbClr val="47D7FF"/></a:hlink><a:folHlink><a:srgbClr val="FF8C6B"/></a:folHlink></a:clrScheme><a:fontScheme name="HTML Basics"><a:majorFont><a:latin typeface="Arial"/><a:ea typeface="Arial Unicode MS"/></a:majorFont><a:minorFont><a:latin typeface="Arial"/><a:ea typeface="Arial Unicode MS"/></a:minorFont></a:fontScheme><a:fmtScheme name="HTML Basics"><a:fillStyleLst/><a:lnStyleLst/><a:effectStyleLst/><a:bgFillStyleLst/></a:fmtScheme></a:themeElements></a:theme>`;

const coreXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>HTML 入门</dc:title><dc:subject>HTML 基础介绍</dc:subject><dc:creator>Codex</dc:creator><cp:lastModifiedBy>Codex</cp:lastModifiedBy></cp:coreProperties>`;

const appXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Microsoft PowerPoint</Application><PresentationFormat>Widescreen</PresentationFormat><Slides>2</Slides><Notes>0</Notes><HiddenSlides>0</HiddenSlides><MMClips>0</MMClips><ScaleCrop>false</ScaleCrop></Properties>`;

const files = new Map([
    ["[Content_Types].xml", contentTypes],
    ["_rels/.rels", rootRels],
    ["ppt/presentation.xml", presentationXml],
    ["ppt/_rels/presentation.xml.rels", presentationRels],
    ["ppt/slideMasters/slideMaster1.xml", masterXml],
    ["ppt/slideMasters/_rels/slideMaster1.xml.rels", masterRels],
    ["ppt/slideLayouts/slideLayout1.xml", layoutXml],
    ["ppt/slideLayouts/_rels/slideLayout1.xml.rels", layoutRels],
    ["ppt/theme/theme1.xml", themeXml],
    ["ppt/slides/slide1.xml", slide1()],
    ["ppt/slides/slide2.xml", slide2()],
    ["ppt/slides/_rels/slide1.xml.rels", "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"><Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout\" Target=\"../slideLayouts/slideLayout1.xml\"/></Relationships>"],
    ["ppt/slides/_rels/slide2.xml.rels", "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"><Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout\" Target=\"../slideLayouts/slideLayout1.xml\"/></Relationships>"],
    ["docProps/core.xml", coreXml],
    ["docProps/app.xml", appXml],
]);

await fs.rm(buildDir, { recursive: true, force: true });
await fs.mkdir(buildDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });
for (const [relative, content] of files) {
    const target = path.join(buildDir, relative);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, content, "utf8");
}

const zip = spawnSync("zip", ["-q", "-r", outputPath, "."], { cwd: buildDir, encoding: "utf8" });
if (zip.status !== 0) {
    throw new Error(`zip failed: ${zip.stderr || zip.stdout}`);
}
console.log(outputPath);
