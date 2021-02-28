const rawCovars = "[\"_autosave\",\"_autosavedangerous\",\"_bugreporter_restart\",\"_record\",\"_resetgamestats\",\"_restart\",\"addip\",\"adsp_reset_nodes\",\"ai_clear_bad_links\",\"ai_debug_node_connect\",\"ai_disable\",\"ai_drop_hint\",\"ai_dump_hints\",\"ai_hull\",\"ai_next_hull\",\"ai_nodes\",\"ai_resume\",\"ai_set_move_height_epsilon\",\"ai_setenabled\",\"ai_show_connect\",\"ai_show_connect_crawl\",\"ai_show_connect_fly\",\"ai_show_connect_jump\",\"ai_show_graph_connect\",\"ai_show_grid\",\"ai_show_hints\",\"ai_show_hull\",\"ai_show_node\",\"ai_show_visibility\",\"ai_step\",\"ai_test_los\",\"ainet_generate_report\",\"ainet_generate_report_only\",\"air_density\",\"alias\",\"'-alt1'\",\"'+alt1'\",\"'-alt2'\",\"'+alt2'\",\"apply_crosshair_code\",\"askconnect_accept\",\"asw_engine_finished_building_map\",\"async_resume\",\"async_suspend\",\"'+attack'\",\"'-attack'\",\"'-attack2'\",\"'+attack2'\",\"audit_save_in_memory\",\"autobuy\",\"autosave\",\"autosavedangerous\",\"autosavedangerousissafe\",\"'-back'\",\"'+back'\",\"banid\",\"banip\",\"bench_end\",\"bench_showstatsdialog\",\"bench_start\",\"bench_upload\",\"benchframe\"]";

const commands = JSON.parse(rawCovars);

/**
 * Search convars
 * @param {*} term 
 */
const search = (term) => {
  const regex = new RegExp(term);
  return commands.filter(command => regex.test(command));
}

module.exports = search;
