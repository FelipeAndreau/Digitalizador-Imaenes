using System;
using System.IO;
using System.Threading.Tasks;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;

namespace Backend.Services
{
    public class ImageProcessorService : IImageProcessorService
    {
        public byte[] Muestrear(byte[] original, int ancho, int alto)
        {
            using var image = Image.Load<Rgba32>(original);
            image.Mutate(x => x.Resize(ancho, alto));

            using var ms = new MemoryStream();
            image.Save(ms, new PngEncoder());
            return ms.ToArray();
        }

        public byte[] Cuantizar(byte[] datos, byte profundidadBits)
        {
            using var image = Image.Load<Rgba32>(datos);

            switch (profundidadBits)
            {
                case 1:
                    // Para 1 bit, convertimos a blanco y negro
                    for (int y = 0; y < image.Height; y++)
                    {
                        for (int x = 0; x < image.Width; x++)
                        {
                            var pixel = image[x, y];
                            // Convertir a escala de grises
                            byte gray = (byte)((pixel.R * 0.299 + pixel.G * 0.587 + pixel.B * 0.114));
                            // Umbral a blanco o negro
                            byte bw = (byte)(gray > 127 ? 255 : 0);
                            image[x, y] = new Rgba32(bw, bw, bw, pixel.A);
                        }
                    }
                    break;

                case 8:
                    // Para 8 bits, cuantizamos cada canal a 256 niveles
                    int niveles8 = 1 << 8; // 256 niveles
                    float step8 = 255f / (niveles8 - 1);
                    for (int y = 0; y < image.Height; y++)
                    {
                        for (int x = 0; x < image.Width; x++)
                        {
                            var pixel = image[x, y];
                            pixel.R = CuantizarCanal(pixel.R, step8);
                            pixel.G = CuantizarCanal(pixel.G, step8);
                            pixel.B = CuantizarCanal(pixel.B, step8);
                            image[x, y] = pixel;
                        }
                    }
                    break;

                case 24:
                    // Para 24 bits, no hacemos cuantización
                    break;

                default:
                    throw new ArgumentException("Profundidad de bits no válida. Debe ser 1, 8 o 24.");
            }

            using var ms = new MemoryStream();
            image.Save(ms, new PngEncoder());
            return ms.ToArray();
        }

        public byte[] Comprimir(byte[] datos, string algoritmo, int nivel)
        {
            using var image = Image.Load<Rgba32>(datos);
            using var ms = new MemoryStream();

            switch (algoritmo.ToUpperInvariant())
            {
                case "JPEG":
                    int calidad = Math.Clamp(nivel, 1, 100);
                    image.Save(ms, new JpegEncoder { Quality = calidad });
                    break;

                case "PNG":
                    int nivelPng = Math.Clamp(nivel, 0, 9);
                    image.Save(ms, new PngEncoder { CompressionLevel = (PngCompressionLevel)nivelPng });
                    break;

                default:
                    throw new NotSupportedException($"Algoritmo no soportado: {algoritmo}");
            }

            return ms.ToArray();
        }


        public async Task<(double mse, double psnr, byte[] diff)> CompararAsync(byte[] original, byte[] procesada)
        {
            await Task.CompletedTask;

            using var imgOrig = Image.Load<Rgba32>(original);
            using var imgProc = Image.Load<Rgba32>(procesada);

            imgProc.Mutate(x => x.Resize(imgOrig.Width, imgOrig.Height));

            int w = imgOrig.Width;
            int h = imgOrig.Height;
            double sumErr = 0;

            using var diffImg = new Image<Rgba32>(w, h);

            for (int y = 0; y < h; y++)
            {
                for (int x = 0; x < w; x++)
                {
                    var o = imgOrig[x, y];
                    var p = imgProc[x, y];
                    int dr = o.R - p.R;
                    int dg = o.G - p.G;
                    int db = o.B - p.B;

                    sumErr += dr * dr + dg * dg + db * db;

                    diffImg[x, y] = new Rgba32(
                        (byte)Math.Min(Math.Abs(dr), 255),
                        (byte)Math.Min(Math.Abs(dg), 255),
                        (byte)Math.Min(Math.Abs(db), 255)
                    );
                }
            }

            double mse = sumErr / (w * h * 3);
            double psnr = mse == 0 ? 100.0 : 10 * Math.Log10(255 * 255 / mse);

            using var msDiff = new MemoryStream();
            diffImg.Save(msDiff, new PngEncoder());

            return (mse, psnr, msDiff.ToArray());
        }

        private byte CuantizarCanal(byte value, float step)
        {
            int nivel = (int)Math.Round(value / step);
            return (byte)Math.Clamp((int)(nivel * step), 0, 255);
        }
    }
}
