export const LOCATIONS = [
  { label: "All locations", value: "" },
  ...[
    "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
    "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu",
  ].map((s) => ({ label: s, value: s })),
  { label: "FCT (Abuja)", value: "Abuja" },
  ...[
    "Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara",
    "Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers",
    "Sokoto","Taraba","Yobe","Zamfara",
  ].map((s) => ({ label: s, value: s })),
];