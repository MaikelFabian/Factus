

//Interfas de Lista

export interface Factura {
    id: number;
    number: string;
    reference_code: string;
    names: string;
    email: string;
    total: string;
    status: number;
    created_at: string;
  }
  
  export interface ListadoProps {
    accessToken: string;
    setMensaje: (mensaje: string) => void;
    setVista: (vista: string) => void;
  }
  