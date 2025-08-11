import { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import {
  FacturaState,
  Cliente,
  Item,
  FacturacionProps,
} from "../types/UsuarioTypes";

const Facturacion: React.FC<FacturacionProps> = ({
  accessToken,
  onBackToListado,
}) => {
 const [factura, setFactura] = useState<FacturaState>({
    document: "01",
    numbering_range_id: 8,
    reference_code: uuidv4(),
    observation: "",
    payment_method_code: 10,
    customer: {
      identification: "",
      dv:  "",
      names: "",
      email: "",
      phone: "",
      legal_organization_id: 2,
      tribute_id: 21,
      identification_document_id: 3,
      municipality_id: 681,
    },
    items: [
      {
        code_reference: "",
        name: "",
        quantity: 1,
        discount_rate: 0,
        price: 0,
        tax_rate: "19.00",
        unit_measure_id: 414,
        standard_code_id: 1,
        is_excluded: 0,
        tribute_id: 1,
        withholding_taxes: [],
      },
    ],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("customer.")) {
      const field = name.split(".")[1] as keyof Cliente;
      setFactura((prev) => ({
        ...prev,
        customer: { ...prev.customer, [field]: value },
      }));
    } else if (name.startsWith("items.")) {
      const [_, index, field] = name.split(".");
      const idx = parseInt(index);
      if (isNaN(idx)) return;

      setFactura((prev) => {
        const updatedItems = [...prev.items];
        const key = field as keyof Item;
        updatedItems[idx] = {
          ...updatedItems[idx],
          [key]: ["price", "discount_rate", "quantity"].includes(field)
            ? parseFloat(value) || 0
            : value,
        };
        return { ...prev, items: updatedItems };
      });
    } else {
      setFactura((prev) => ({ ...prev, [name]: value }));
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!accessToken) throw new Error("Debes iniciar sesión primero.");

      console.log("Enviando datos:", JSON.stringify(factura, null, 2));

      const response = await axios.post(
        `https://api-sandbox.factus.com.co/v1/bills/validate`,
        factura,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Factura enviada",
        text: "La factura se ha enviado con éxito.",
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      Swal.fire({
        icon: "error",
        title: "Error al enviar la factura",
        text: error.response?.data?.message || "Ocurrió un error",
      });
    },
  });

  return (
    <div className="min-h-screen bg-[#12002f] flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-xl p-8">
        <div className="flex justify-center mb-4">
          <img
            src="/img/image.png"
            alt="Logo"
            className="h-20 object-contain"
          />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Facturación
        </h2>

        <h3 className="text-xl font-semibold mb-3 text-gray-700">
          Información del Cliente
        </h3>
        <div className="space-y-3 mb-6">
          <input
            type="text"
            name="customer.identification"
            placeholder="Identificación"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            name="customer.names"
            placeholder="Nombre Completo"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="email"
            name="customer.email"
            placeholder="Correo Electrónico"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            name="customer.phone"
            placeholder="Teléfono"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <h3 className="text-xl font-semibold mb-3 text-gray-700">Productos</h3>
        <div className="space-y-4 mb-6">
          {factura.items.map((_item, index) => (
            <div key={index} className="grid grid-cols-5 gap-2">
              <input
                type="text"
                name={`items.${index}.code_reference`}
                placeholder="Código"
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                name={`items.${index}.name`}
                placeholder="Producto"
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                name={`items.${index}.quantity`}
                placeholder="Cantidad"
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                name={`items.${index}.price`}
                placeholder="Valor"
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                name={`items.${index}.discount_rate`}
                placeholder="Descuento %"
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-gray-800">
          Total: $
          {factura.items
            .reduce(
              (total, item) =>
                total +
                item.price * item.quantity * (1 - item.discount_rate / 100),
              0
            )
            .toFixed(2)}
        </h3>

        <div className="mt-6 flex gap-4 justify-end">
          <button
            onClick={() => mutation.mutate()}
            className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition"
          >
            Enviar Factura
          </button>
          <button
            onClick={onBackToListado}
            className="bg-gray-300 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-400 transition"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default Facturacion;
