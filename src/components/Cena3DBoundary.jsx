import { Component } from 'react';

// =====================================================================
// Guarda-corpo das cenas 3D: se o WebGL falhar em runtime (driver,
// contexto perdido, bug de biblioteca), a mesa NÃO cai — renderiza o
// fallback 2D. Aviso vai como warn (o QA exige zero console.error).
//
// Dois caminhos até o fallback:
//   1. exceção durante o render (getDerivedStateFromError, como antes);
//   2. o evento webglcontextlost do canvas, que NÃO vira exceção React —
//      o filho recebe perderContexto() via children-como-função e o
//      chama do listener (P3 do playtest: a maquete não fica preta).
// =====================================================================
export default class Cena3DBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { falhou: false };
    this.perderContexto = this.perderContexto.bind(this);
  }

  static getDerivedStateFromError() {
    return { falhou: true };
  }

  componentDidCatch(erro) {
    console.warn('Cena 3D indisponível — a mesa segue em 2D.', erro?.message || erro);
  }

  perderContexto() {
    if (this.state.falhou) return;
    console.warn('Contexto WebGL perdido — a mesa segue em 2D.');
    this.setState({ falhou: true });
  }

  render() {
    if (this.state.falhou) return this.props.fallback;
    return typeof this.props.children === 'function'
      ? this.props.children(this.perderContexto)
      : this.props.children;
  }
}
