import { Component } from 'react';

// =====================================================================
// Guarda-corpo das cenas 3D: se o WebGL falhar em runtime (driver,
// contexto perdido, bug de biblioteca), a mesa NÃO cai — renderiza o
// fallback 2D. Aviso vai como warn (o QA exige zero console.error).
// =====================================================================
export default class Cena3DBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { falhou: false };
  }

  static getDerivedStateFromError() {
    return { falhou: true };
  }

  componentDidCatch(erro) {
    console.warn('Cena 3D indisponível — a mesa segue em 2D.', erro?.message || erro);
  }

  render() {
    return this.state.falhou ? this.props.fallback : this.props.children;
  }
}
