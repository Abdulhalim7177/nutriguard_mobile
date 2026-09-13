import { db } from '../db/sqlite';

export const getFlaggedUsers = async () => {
  const allScreenings = await db.getAllScreenings();
  
  // Only return those flagged as possible_risk or elevated_risk
  return allScreenings.filter(s => 
    s.riskBand === 'possible_risk' || s.riskBand === 'elevated_risk'
  );
};
