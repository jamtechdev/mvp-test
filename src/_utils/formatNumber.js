/* A tiny formatter that always outputs US‑style commas,
   so server‑rendered HTML = client render 100 % of the time. */

const nf0 = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

const nf2 = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const n0 = x => nf0.format(Number(x) || 0);   // 123,456
export const n2 = x => nf2.format(Number(x) || 0);   // 1,234.56
