import React, { useState } from "react";

export default function Home(props) {
  const { user } = props;
  return (
    <div className="container">
      <div>{JSON.stringify(user)}</div>
      <div>Home</div>
    </div>
  )
};
