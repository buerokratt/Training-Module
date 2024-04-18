export const generateHTMLTable = (messages, chatHistoryTable) => {
  let _html = `<tr class="header">
                  <th style="text-align: left">author</th>
                  <th style="text-align: left">author role</th>
                  <th style="text-align: left">message</th>
                  <th style="text-align: left">event</th>
                  <th style="text-align: left">sent</th>
              </tr>`;

  for (let i = 0; i < messages.length; i++) {
    _html += `<tr>
            <td style="padding-right: 50px; border-bottom:1px solid lightgray">${
              messages[i].authorFirstName || "-"
            }</td>
            <td style="padding-right: 50px; border-bottom:1px solid lightgray">${
              messages[i].authorRole || "-"
            }</td>
            <td style="padding-right: 50px; border-bottom:1px solid lightgray">${
              messages[i].content || "-"
            }</td>
            <td style="padding-right: 50px; border-bottom:1px solid lightgray">${
              messages[i].event || "-"
            }</td>
            <td style="padding-right: 50px; border-bottom:1px solid lightgray">${new Date(
              messages[i].created
            ).toLocaleDateString("et-EE")}</td>
        </tr>`;
  }

  chatHistoryTable.innerHTML = _html;
};
