import { ActionType } from "../types";

interface ICardProps {
  action: ActionType;
}

export const Card = ({ action }: ICardProps) => {
  return (
    <li className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
      <p>
        <strong>Action:</strong> {action.description}
      </p>
      <p>
        <strong>Owner:</strong> {action.owner}
      </p>
      <p>
        <strong>Deadline:</strong> {action.deadline}
      </p>
    </li>
  );
};
