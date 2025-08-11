export interface Cliente {
  identification: string;
  dv: string;
  names: string;
  email: string;
  phone: string;
  legal_organization_id: number;
  tribute_id: number;
  identification_document_id: number;
  municipality_id: number;
}

export interface Item {
  code_reference: string;
  name: string;
  quantity: number;
  discount_rate: number;
  price: number;
  tax_rate: string;
  unit_measure_id: number;
  standard_code_id: number;
  is_excluded: number;
  tribute_id: number;
  withholding_taxes: never[];
}

export interface FacturaState {
  document: string;
  numbering_range_id: number;
  reference_code: string;
  observation: string;
  payment_method_code: number;
  customer: Cliente;
  items: Item[];
}


  export interface FacturacionProps {
    accessToken: string;
    setMensaje: (mensaje: string) => void;
    onBackToListado: () => void;
  }


