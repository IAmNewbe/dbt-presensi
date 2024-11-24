import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableAll from '../components/Tables/TableAll';
import TableOne from '../components/Tables/TableOne';
import TableThree from '../components/Tables/TableThree';
import TableTwo from '../components/Tables/TableTwo';

const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableAll />
        <TableTwo />
        {/* <TableThree /> */}
      </div>
    </>
  );
};

export default Tables;
