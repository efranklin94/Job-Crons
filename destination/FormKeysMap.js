PluginManager.plugins.LetterFlowProcess = (function() {
    var formKey2FormNameMap = {};
    formKey2FormNameMap["_13$TASK$PAT_TP_GenerateLetter"] = "compose_letter_form";
    formKey2FormNameMap["_7$TASK$PAT_TP_GenerateLetter"] = "compose_letter_form";
    formKey2FormNameMap["_6$TASK$PAT_TP_RegisterOutgoingLetter"] = "compose_outgoing_letter_form";
    formKey2FormNameMap["_6$TASK$PAT_TP_GenerateByDraft"] = "compose_letter_form";
    formKey2FormNameMap["_6$TASK$PAT_TP_GenerateRelatedLetter"] = "compose_letter_form";
    formKey2FormNameMap["_8$TASK$PAT_TP_CopyLetter"] = "compose_letter_form";
    formKey2FormNameMap["_12$PAT_TP_SubmitDraftLetter"] = "compose_letter_form";
    formKey2FormNameMap["_4$TASK$PAT_TP_ViewLetter"] = "PAT_TP_ViewLetter";

    return {
        getHeaderMenuProperties : function() {
            return {
                "icon" : ""
            }
        },
        getStartMenus : function() {
            var menuAction1 =
                new MenuAction('COMPOSE', MenuTypes.START_PROCESS, "ion-ios-email", "_4", "LetterFlowProcess",false,null,null);
            var menuAction2 =
                new MenuAction('COMPOSE_OUTGOING', MenuTypes.START_PROCESS, "ion-ios-email", "_13", "OutgoingLetterFlow",false,null,null);

            var menuActions = [];
            menuActions.push(menuAction1,menuAction2);
            return menuActions;
        },
        getFormNameForFormKey : function(formKey) {
            return formKey2FormNameMap[formKey];
        },
        getCartableFormatter : function() {
            return "LetterCartableFormatter";
        }
    }
})();

PluginManager.plugins.OutgoingLetterFlow = (function() {
    var formKey2FormNameMap = {};
    formKey2FormNameMap["_6$TASK$PAT_TP_RegisterOutgoingLetter"] = "compose_outgoing_letter_form";
    formKey2FormNameMap["_9$TASK$PAT_TP_EditOutgoingLetter"] = "compose_outgoing_letter_form";
    formKey2FormNameMap["_10$TASK$PAT_TP_CopyLetter"] = "compose_outgoing_letter_form";
    formKey2FormNameMap["_17$TASK$PAT_TP_GenerateByDraft"] = "compose_outgoing_letter_form";
    formKey2FormNameMap["_17$TASK$PAT_TP_GenerateByDraft"] = "compose_outgoing_letter_form";
    return {
        getFormNameForFormKey : function(formKey) {
            return formKey2FormNameMap[formKey];
        },
        getCartableFormatter : function() {
            return "LetterCartableFormatter";
        }
    }
})();

PluginManager.plugins.VerifyLetterProcess = (function() {
    var formKey2FormNameMap = {};
    formKey2FormNameMap["_4$TASK$PAT_TP_VerifyLetter"] = "PAT_TP_VerifyLetter"; // مشاهده و ارجاع نامه (مشاهده) - فعال 6844
    formKey2FormNameMap["_20$TASK$PAT_TP_VerifyLetter"] = "PAT_TP_ViewLetter"; //  7009 مشاهده و ارجاع نامه (وارده) - فعال

    return {
        getFormNameForFormKey : function(formKey) {
            return formKey2FormNameMap[formKey];
        },
        getCartableFormatter : function() {
            return "LetterCartableFormatter";
        }
    }
})();

PluginManager.plugins.PAT_TP_VerifyLetter = (function() {
    return {
        getCartableFormatter : function() {
            return "LetterCartableFormatter";
        }
    }
})();

PluginManager.plugins.PAT_TP_VerifyNewLetter = (function() {
    return {
        getCartableFormatter : function() {
            return "LetterCartableFormatter";
        }
    }
})();

PluginManager.plugins.PAT_TP_NewGenerateLetter = (function() {
    return {
        getCartableFormatter : function() {
            return "LetterCartableFormatter";
        }
    }
})();

PluginManager.plugins.PAT_TP_SendMessageToSigner = (function() {
    return {
        getCartableFormatter : function() {
            return "LetterCartableFormatter";
        }
    }
})();

PluginManager.plugins.PAT_TP_GenerateLetter = (function() {
    return {
        getCartableFormatter : function() {
            return "LetterCartableFormatter";
        }
    }
})();

PluginManager.plugins.PAT_TP_RegisterOutgoingLetter = (function() {
    return {
        getCartableFormatter : function() {
            return "LetterCartableFormatter";
        }
    }
})();

PluginManager.plugins.PAT_TP_SubmitDraftLetter = (function() {
    return {
        getCartableFormatter : function() {
            return "LetterCartableFormatter";
        }
    }
})();

PluginManager.plugins.PAT_TP_ViewLetter = (function() {
    return {
        getCartableFormatter : function() {
            return "LetterCartableFormatter";
        }
    }
})();

PluginManager.plugins.PAT_TP_ViewNewLetter = (function() {
    return {
        getCartableFormatter : function() {
            return "LetterCartableFormatter";
        }
    }
})();

PluginManager.plugins.PAT_BP_SearchAndViewLetters = (function() {
    var formKey2FormNameMap = {};
        formKey2FormNameMap["_34$TASK$PAT_TP_ViewLetter"] = "PAT_TP_ViewLetter";
        formKey2FormNameMap["_60$TASK$PAT_TP_ViewLetter"] = "PAT_TP_ViewLetter";
        formKey2FormNameMap["_8$TASK$PAT_TP_ViewNewLetter"] = "PAT_TP_ViewNewLetter";

        return {
            getFormNameForFormKey : function(formKey) {
                return formKey2FormNameMap[formKey];
            },
            getCartableFormatter : function() {
                return "LetterCartableFormatter";
            }
        }
})();

PluginManager.plugins.ApproveLetterProcess = (function() {
    var formKey2FormNameMap = {};
    formKey2FormNameMap["_34$TASK$PAT_TP_VerifyLetter"] = "PAT_TP_ViewLetter";
    formKey2FormNameMap["_34$PAT_TP_VerifyLetter"] = "PAT_TP_ViewLetter";
    formKey2FormNameMap["_60$TASK$PAT_TP_VerifyLetter"] = "PAT_TP_ViewLetter";

    return {
        getFormNameForFormKey : function(formKey) {
            return formKey2FormNameMap[formKey];
        },
        getCartableFormatter : function() {
            return "LetterCartableFormatter";
        }
    }
})();



PluginManager.plugins.PAT_TP_EditOutgoingLetter = (function() {
    var formKey2FormNameMap = {};

    return {
        getFormNameForFormKey : function(formKey) {
            return formKey2FormNameMap[formKey];
        },
        getCartableFormatter : function() {
            return "LetterCartableFormatter";
        }
    }
})();

PluginManager.plugins.PAT_RBP_NewVerifyFlow = (function() {
    var formKey2FormNameMap = {};
    formKey2FormNameMap["_7$TASK$PAT_TP_VerifyNewLetter"] = "PAT_TP_VerifyNewLetter";
    formKey2FormNameMap["_6$TASK$PAT_TP_SendMessageToSigner"] = "PAT_TP_SendMessageToSigner";    

    return {
        getFormNameForFormKey : function(formKey) {
            return formKey2FormNameMap[formKey];
        },
        getCartableFormatter : function() {
            return "LetterCartableFormatter";
        }
    }
})();

PluginManager.plugins.PAT_BP_NewLetterFlow = (function() {
    var formKey2FormNameMap = {};
    formKey2FormNameMap["_5$TASK$PAT_TP_NewGenerateLetter"] = "PAT_TP_NewGenerateLetter";

    return {
        getFormNameForFormKey : function(formKey) {
            return formKey2FormNameMap[formKey];
        },
        getCartableFormatter : function() {
            return "LetterCartableFormatter";
        }
    }
})();

PluginManager.plugins.PAT_BP_DefineBasicInfo = (function() {
    var formKey2FormNameMap = {};
    formKey2FormNameMap["_6$TASK$PAT_TP_GenerateAndUpdateGroup"] = "PAT_TP_GenerateAndUpdateGroup";
    formKey2FormNameMap["_14$TASK$PAT_TP_GenerateAndUpdateGroup"] = "PAT_TP_GenerateAndUpdateGroup";

    return {
        getFormNameForFormKey : function(formKey) {
            return formKey2FormNameMap[formKey];
        },
        getCartableFormatter : function() {
            return "LetterCartableFormatter";
        }
    }
})();

