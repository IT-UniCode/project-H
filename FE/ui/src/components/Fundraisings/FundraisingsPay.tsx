import { Button } from "@components/Button";
import { Drawer } from "@components/Drawer";
import { Select } from "@components/Select";
import { TextField } from "@components/TextFields";
import { Currency } from "@constant/index";
import { useForm } from "@hooks/useForm";
import paymentService from "@service/payment.service";
import clsx from "clsx";
import { useState } from "preact/hooks";

interface Payments {
  url: string;
  loading: boolean;
  open: boolean;
}

interface Form {
  amount: string;
  currency: Currency;
}

const cyrency = [
  {
    value: Currency.uah,
    label: "UAH",
  },
  {
    value: Currency.usd,
    label: "USD",
  },
  {
    value: Currency.eur,
    label: "EUR",
  },
];

export interface FundraisingsPayProps {
  fundraisingId: string;
}

function FundraisingsPay({ fundraisingId }: FundraisingsPayProps) {
  const [payments, setPayments] = useState<Payments>({
    url: "",
    loading: false,
    open: false,
  });

  const { keys, onSubmit } = useForm<Form>({
    values: {
      amount: {},
      currency: {},
    },
    async onSubmit(values, context) {
      console.log(values);

      if (!values.amount || !parseInt(values.amount)) {
        return;
      }

      if (
        !values.currency ||
        !Object.values(Currency).includes(values.currency as Currency)
      ) {
        return;
      }

      if (payments.loading) {
        return;
      }

      setPayments((prev) => ({ ...prev, loading: true }));
      const res = await paymentService.checkoutFundraising({
        amount: values.amount,
        currency: values.currency,
        fundraisingId,
      });

      console.log(res);

      setPayments((prev) => ({ ...prev, url: res.url, loading: false }));
      window.open(res.url, "_blank", "noopener,noreferrer");
    },
  });

  async function handlerOnClick() {
    if (payments.loading || payments.open) {
      return;
    }

    if (payments.url) {
      window.open(payments.url, "_blank", "noopener,noreferrer");
      return;
    }

    setPayments((prev) => ({ ...prev, open: true }));
  }

  return (
    <section>
      <Button
        class={clsx({
          "animate-pulse bg-gray-600 hover:bg-gray-600":
            payments.loading || payments.open,
        })}
        onClick={handlerOnClick}
        disabled={payments.loading || payments.open}
      >
        Get Payment
      </Button>

      <Drawer
        open={payments.open}
        close={() => setPayments((prev) => ({ ...prev, open: false }))}
      >
        <div className="p-6 pt-10 relative">
          <div class="absolute right-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
            <button
              onClick={() => setPayments((prev) => ({ ...prev, open: false }))}
              type="button"
              class="relative rounded-md text-gray-400 hover:text-gray-800 focus:outline-none"
            >
              <span class="absolute -inset-2.5 "></span>
              <span class="sr-only">Close panel</span>
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <h2 className="text-5xl font-bold mb-3">
            Select the currency and amount of funds to collect
          </h2>

          <form onSubmit={onSubmit} class="flex flex-col gap-y-3">
            <TextField name={keys.amount} placeholder="Amount" type="number" />
            <Select
              name={keys.currency}
              items={cyrency}
              placeholder="Curency"
            />
            <Button
              class={clsx({
                "animate-pulse bg-gray-600 hover:bg-gray-600": payments.loading,
              })}
              disabled={payments.loading}
            >
              Submit
            </Button>
          </form>
        </div>
      </Drawer>
    </section>
  );
}

export default FundraisingsPay;
