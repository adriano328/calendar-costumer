import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  success(message: string) {
    Swal.fire({
      icon: 'success',
      title: message,
      timer: 2500,
      customClass: {
        title: 'swal2-title',
        icon: 'swal2-icon'
      }
    });
  }

  error(message: string) {
    Swal.fire({
      icon: 'error',
      title: message,
      timer: 2500,
      customClass: {
        title: 'swal2-title',
        icon: 'swal2-icon'
      }
    });
  }

  warn(message: string) {
    Swal.fire({
      icon: 'warning',
      title: message,
      timer: 2500,
      customClass: {
        title: 'swal2-title',
        icon: 'swal2-icon'
      }
    });
  }

  confirmation(pergunta: string, confirmacao: string, onConfirm: () => void) {
    Swal.fire({
      text: `${pergunta}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Não",
      confirmButtonText: "Sim",
      backdrop: `
        rgba(0,0,0,0.4)
        left top
        no-repeat
      `
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm(); 
        Swal.fire({
          text: `${confirmacao}`,
          icon: "success"
        });
      }
    });
  }
}
