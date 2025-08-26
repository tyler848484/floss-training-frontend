import React, { Children, useEffect, useState } from "react";
import { Card, Form, Button, Row, Col, Alert, Modal } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Child } from "../types";
import AccountInfoCard from "./AccountInfoCard";
import ChildrenInfoCard from "./ChildrenInfoCard";

const AccountInfoSection: React.FC = () => {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}>
      <AccountInfoCard />
      <ChildrenInfoCard />
    </div>
  );
};

export default AccountInfoSection;
