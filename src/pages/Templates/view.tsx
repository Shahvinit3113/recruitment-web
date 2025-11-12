import React from "react";
import { useParams } from "react-router-dom";

const ViewTemplate = () => {
  const { Uid } = useParams();
  return <>{Uid}</>;
};

export default ViewTemplate;
