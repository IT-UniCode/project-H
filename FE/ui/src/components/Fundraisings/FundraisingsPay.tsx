import { Button } from "@components/Button";
import { useState } from "preact/hooks";

interface Payments {
  url: string;
}

function FundraisingsPay() {
  const [payments, setPayments] = useState<Payments>({ url: "" });

  function handlerOnClick() {
    if (payments.url) {
      window.open(payments.url, "_blank", "noopener,noreferrer");
    } else {
    }
  }

  return (
    <>
      <Button onClick={handlerOnClick}>Pay</Button>
    </>
  );
}

export default FundraisingsPay;
