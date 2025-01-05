import { useTranslation } from 'react-i18next';
export default function Filter() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <div className="filter-container" style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>

          <div className="col-md-2">
            <input
              type="text"
              className="form-control"
              id="staticEmail"
              value=""
              placeholder="Search By Name"
              style={{ borderRadius: '5px', padding: '10px' }}
            />
          </div>

          <div className="col-md-2">
            <select className="form-select" id="exampleSelect1" style={{ borderRadius: '5px', padding: '10px' }}>
              <option selected>{t("Select Department")}</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>

          <div className="col-md-2">
            <select className="form-select" id="exampleSelect2" style={{ borderRadius: '5px', padding: '10px' }}>
            <option selected>{t("Select Address")}</option>
            <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>

          <div className="col-md-2">
            <select className="form-select" id="exampleSelect3" style={{ borderRadius: '5px', padding: '10px' }}>
            <option selected> {t("Select Gender")} </option>
            <option></option>
              <option></option>
              <option></option>
              <option></option>
            </select>
          </div>

         

          <div className="col-md-3">
            <button type="button" className="btn btn-success" style={{ padding: '10px 20px', marginRight: '10px' }}>{t("Apply Filter")}</button>
            <button type="button" className="btn btn-danger" style={{ padding: '10px 20px' }}>{t("Clear Filter")}</button>
          </div>

        </div>
      </div>
    </>
  );
}
