// UI framework styles
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-dark/theme.css';
import '../styles/shared.css';

export default ({ Component, PageProps }) => {
  return <Component {...PageProps} />;
};
