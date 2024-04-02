export type LoginProduct = {
  icon: any;
  name: string;
};

export type LoginType = {
  title: string;
  description: string;
  id: string;
  url: string;
  products?: LoginProduct[];
  entryButton?: {
    text: string;
    disabled?: boolean;
    onClick?: () => void;
  };
  preventClickthrough?: boolean;
};
