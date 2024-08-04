import { Helmet } from "react-helmet-async";

const Meta = ({ title =  'Adab NY', description = 'Best Collection of Fragrances', keywords = 'perfumes, colognes, fragrances'}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
    </Helmet>
  );
};

export default Meta;