import React from "react";
import { useParams } from "react-router-dom";

const view = () => {
  const { Uid } = useParams();
  return <>{Uid}</>;
};

export default view;
