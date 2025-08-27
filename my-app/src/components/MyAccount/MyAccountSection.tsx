import React from "react";
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
