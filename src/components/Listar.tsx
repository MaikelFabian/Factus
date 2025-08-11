import React, { useEffect, useState } from "react";
import axios from "axios";
import { Factura, ListadoProps } from "../types/ListarTypes";

const Listar: React.FC<ListadoProps> = ({
  accessToken,
  setMensaje,
  setVista,
}) => {
  const [facturas, setFacturas] = useState<Factura[]>([]);

  const obtenerFacturas = async () => {
    try {
      const response = await axios.get(
        "https://api-sandbox.factus.com.co/v1/bills",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setFacturas(
        Array.isArray(response.data?.data?.data) ? response.data.data.data : []
      );
    } catch (error: any) {
      setMensaje(
        `Error al obtener las facturas: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const descargarFactura = async (numeroFactura: string) => {
    try {
      const response = await axios.get(
        `https://api-sandbox.factus.com.co/v1/bills/download-pdf/${numeroFactura}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const pdfBase64 = response.data?.data?.pdf_base_64_encoded;
      if (!pdfBase64) throw new Error("La API no devolvió el PDF.");

      const linkSource = `data:application/pdf;base64,${pdfBase64}`;
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = `${
        response.data.data.file_name || `Factura_${numeroFactura}`
      }.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error: any) {
      console.error("Error al descargar la factura:", error);
      setMensaje(
        `Error al descargar la factura: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  useEffect(() => {
    obtenerFacturas();
  }, []);

  return (
    <div className="min-h-screen bg-[#12002f] py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6">
        <div className="flex flex-col items-center mb-6">
          <img src="/img/image.png" alt="Logo" className="h-16 mb-2" />
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Lista de Facturas
          </h2>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setVista("crear-factura")}
            className="bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700 transition"
          >
            Registrar
          </button>
        </div>

        {facturas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2 border">Serie</th>
                  <th className="p-2 border">Referencia</th>
                  <th className="p-2 border">Cliente</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Total</th>
                  <th className="p-2 border">Estado</th>
                  <th className="p-2 border">Fecha</th>
                  <th className="p-2 border">Descargas</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((factura) => (
                  <tr key={factura.id} className="hover:bg-gray-50">
                    <td className="p-2 border text-center">{factura.number}</td>
                    <td className="p-2 border text-center">
                      {factura.reference_code || "N/A"}
                    </td>
                    <td className="p-2 border text-center">
                      {factura.names || "Desconocido"}
                    </td>
                    <td className="p-2 border text-center">
                      {factura.email || "No disponible"}
                    </td>
                    <td className="p-2 border text-center">${factura.total}</td>
                    <td className="p-2 border text-center">
                      {factura.status === 1 ? (
                        <span className="text-green-600 font-semibold">
                          Validada
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td className="p-2 border text-center">
                      {factura.created_at}
                    </td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => descargarFactura(factura.number)}
                        className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-6">
            No hay facturas disponibles.
          </p>
        )}
      </div>
    </div>
  );
};

export default Listar;
