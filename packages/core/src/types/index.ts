export interface Customer {
  uuid: string;
  name: string;
  contact_id: string;
  channel_id: string;
  channel_name: string;
  platform_nick: string;
  image_url: string | null;
}

export interface UserTying {
  typer_id: string;
  thread_id: string;
  user_type: "user" | "customer";
  message_type: "message" | "comment";
  typer_info: { name: string; id: string; image_url?: string | null };
}

export interface Sound {
  key: string;
  label: string;
  url: string;
}

export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
  children?: React.ReactNode;
  size?: string | number;
  color?: string;
  title?: string;
}
export type IconType = (props: IconBaseProps) => JSX.Element;

export interface AssignLogEntity {
  name: string;
  uuid: string;
  color?: string;
  image_url?: string;
  type: "user" | "team" | "profile";
  owner: {
    name: string;
    uuid: string;
    color?: string;
    image_url?: string;
  };
}
