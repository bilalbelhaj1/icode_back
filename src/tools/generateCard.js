
const generateCard = async (qrcode,firstName,lastName,apogee) => {
    return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#f4f4f4;">

<table align="center" width="600" height="250" cellpadding="0" cellspacing="0"
style="background-color:white;
border-radius:15px;
box-shadow:0 4px 10px rgba(0,0,0,0.2);
font-family:Arial, sans-serif;">

<tr>

<!-- LEFT SIDE -->
<td width="65%" style="padding:20px; vertical-align:top;">

    <!-- Logo + Titre -->
    <table cellpadding="0" cellspacing="0">
        <tr>
            <td style="vertical-align:middle;">
                <img src="cid:logo" width="60" style="display:block;">
            </td>
            <td style="padding-left:10px; vertical-align:middle;">
                <h2 style="margin:0;color:#2c3e50;">iCode Membership Card</h2>
            </td>
        </tr>
    </table>

    <!-- Infos étudiant -->
    <div style="margin-top:25px; font-size:16px; color:#333;">
        <p style="margin:5px 0;"><strong>First Name :</strong> ${firstName}</p>
        <p style="margin:5px 0;"><strong>Last Name :</strong> ${lastName}</p>
        <p style="margin:5px 0;"><strong>Apogee :</strong> ${apogee}</p>
    </div>

</td>

<!-- RIGHT SIDE (QR Code) -->
<td width="35%" align="center" style="padding:20px;">
    <img src="cid:qrcode" width="140" height="140" style="display:block;">
</td>

</tr>

</table>

</body>
</html>
`
};

module.exports = {generateCard};