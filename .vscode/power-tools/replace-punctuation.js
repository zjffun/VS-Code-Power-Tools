const replaceSelections = async (replaceFn, vscode) => {
  const { activeTextEditor } = vscode.window;
  if (!activeTextEditor?.document) {
    return false;
  }

  const workspaceEdit = new vscode.WorkspaceEdit();

  for (const selection of activeTextEditor.selections) {
    const text = activeTextEditor.document.getText(selection);

    workspaceEdit.replace(
      activeTextEditor.document.uri,
      selection,
      replaceFn(text)
    );
  }

  return await vscode.workspace.applyEdit(workspaceEdit);
};

exports.execute = async (args) => {
  const vscode = args.require("vscode");

  let firstSingleQuotationMark = true;
  let firstDoubleQuotationMark = true;

  let punctuationMap = {
    ",": "，",
    ".": "。",
    "!": "！",
    "?": "？",
    "[": "【",
    "]": "】",
    "(": "（",
    ")": "）",
  };

  replaceSelections((text) => {
    let result = "";

    for (const c of text) {
      if (c === '"') {
        if (firstDoubleQuotationMark) {
          result += "“";
        } else {
          result += "”";
        }
        firstDoubleQuotationMark = !firstDoubleQuotationMark;
      } else if (c === "'") {
        if (firstSingleQuotationMark) {
          result += "‘";
        } else {
          result += "’";
        }
        firstSingleQuotationMark = !firstSingleQuotationMark;
      } else if (punctuationMap[c]) {
        result += punctuationMap[c];
      } else {
        result += c;
      }
    }

    return result;
  }, vscode);
};
