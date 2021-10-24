import React from "react";
import { useTranslation } from "react-i18next";

const Translation = ({ children, expand, className = '' }) => {
  const { t } = useTranslation();
  return (
    <span className={className}>
      {t(children)}
      {expand}
    </span>
  );
};

export default Translation;
