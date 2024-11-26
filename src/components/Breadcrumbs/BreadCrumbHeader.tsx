import { Link } from 'react-router-dom';
interface BreadcrumbProps {
  tribe: string;
  date: string;
}
const BreadcrumbHeader = ({ tribe, date }: BreadcrumbProps) => {
  return (
    <div className="hidden mb-6 lg:flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" to="/">
              {tribe} |
            </Link>
          </li>
          <li className="font-medium text-blueeazy">{date}</li>
        </ol>
      </nav>
    </div>
  );
};

export default BreadcrumbHeader;
