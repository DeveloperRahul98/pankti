import QRCode from "qrcode";

export async function qrDataUrl(text: string, size = 256): Promise<string> {
  return QRCode.toDataURL(text, {
    width: size,
    margin: 1,
    errorCorrectionLevel: "M",
    color: {
      dark: "#0e0e0f",
      light: "#ffffff",
    },
  });
}

export async function qrSvg(text: string): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: {
      dark: "#0e0e0f",
      light: "#ffffff",
    },
  });
}
